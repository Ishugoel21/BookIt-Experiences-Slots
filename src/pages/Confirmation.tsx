import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  if (!bookingData) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-md mx-auto text-center space-y-4 sm:space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-success/10 rounded-full flex items-center justify-center border-4 border-success">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-success" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold">Booking Confirmed</h1>

          <div className="text-muted-foreground">
            <p className="mb-2">Ref ID: {bookingData.bookingId}</p>
            <p className="text-sm">
              A confirmation email has been sent to {bookingData.email}
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 sm:p-6 space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Experience</span>
              <span className="font-semibold">{bookingData.experienceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-semibold">{bookingData.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time</span>
              <span className="font-semibold">{bookingData.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity</span>
              <span className="font-semibold">{bookingData.quantity}</span>
            </div>
            <div className="flex justify-between pt-3 border-t">
              <span className="font-semibold">Total Paid</span>
              <span className="font-bold text-lg">₹{bookingData.finalTotal}</span>
            </div>
          </div>

          <Button
            onClick={() => navigate("/")}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            size="lg"
          >
            Back to Home
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Confirmation;
