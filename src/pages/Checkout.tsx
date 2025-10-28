import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { validateCoupon, recordCouponUsage, createBooking } from "@/lib/api";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const bookingData = location.state;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [validatedCouponId, setValidatedCouponId] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [appliedCouponCode, setAppliedCouponCode] = useState("");

  if (!bookingData) {
    navigate("/");
    return null;
  }

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast({
        title: "Enter a coupon code",
        description: "Please enter a coupon code to apply.",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);

    try {
      const data = await validateCoupon({
        code: promoCode,
        subtotal: bookingData.subtotal,
      });

      if (data.valid) {
        setDiscount(data.discount);
        setValidatedCouponId(data.couponId);
        setAppliedCouponCode(promoCode.toUpperCase());
        toast({
          title: "Coupon applied!",
          description: `You saved ₹${data.discount} with code ${promoCode.toUpperCase()}`,
        });
      } else {
        setDiscount(0);
        setValidatedCouponId(null);
        setAppliedCouponCode("");
        toast({
          title: "Invalid coupon",
          description: data.error || "Please check your coupon code and try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error applying coupon:", error);
      setDiscount(0);
      setValidatedCouponId(null);
      setAppliedCouponCode("");
      toast({
        title: "Error",
        description: "Failed to validate coupon code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const finalTotal = bookingData.total - discount;

  const handlePayment = async () => {
    if (!fullName || !email || !agreedToTerms) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and accept the terms.",
        variant: "destructive",
      });
      return;
    }

    // Record coupon usage if a coupon was applied
    if (validatedCouponId) {
      try {
        await recordCouponUsage({
          couponId: validatedCouponId,
          email: email,
        });
      } catch (err) {
        console.error("Error recording coupon usage:", err);
      }
    }

    try {
      // Create booking in database
      const bookingResponse = await createBooking({
        experienceId: bookingData.experienceId,
        experienceName: bookingData.experienceName,
        date: bookingData.date,
        time: bookingData.time,
        quantity: bookingData.quantity,
        customerName: fullName,
        customerEmail: email,
        subtotal: bookingData.subtotal,
        taxes: bookingData.taxes,
        total: finalTotal,
        discount: discount,
        appliedCoupon: appliedCouponCode || undefined,
      });

      const bookingId = bookingResponse.booking.bookingId;

      navigate("/confirmation", {
        state: {
          bookingId,
          ...bookingData,
          fullName,
          email,
          finalTotal,
          appliedCoupon: appliedCouponCode || null,
        },
      });
    } catch (error: any) {
      toast({
        title: "Booking failed",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-4 sm:py-8 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 sm:mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Checkout
        </Button>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Full name
                  </label>
                  <Input
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="test@test.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Coupon code
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Try SAVE10, FLAT100, WELCOME50"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={!!appliedCouponCode}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                    />
                    <Button
                      onClick={handleApplyPromo}
                      disabled={isValidating || !!appliedCouponCode}
                      variant="outline"
                      className="bg-foreground text-background hover:bg-foreground/90"
                    >
                      {isValidating ? "Checking..." : appliedCouponCode ? "Applied" : "Apply"}
                    </Button>
                  </div>
                  {appliedCouponCode && (
                    <p className="text-sm text-success mt-2">
                      ✓ Coupon {appliedCouponCode} applied successfully!
                    </p>
                  )}
                </div>

                <div className="flex items-start gap-2 pt-4">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) =>
                      setAgreedToTerms(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    I agree to the terms and safety policy
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="font-semibold">{bookingData.experienceName}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold">{bookingData.date}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-semibold">{bookingData.time}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Qty</p>
                  <p className="font-semibold">{bookingData.quantity}</p>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{bookingData.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxes</span>
                    <span>₹{bookingData.taxes}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-success">
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                >
                  Pay and Confirm
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
