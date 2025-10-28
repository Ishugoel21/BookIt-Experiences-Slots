import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { experiences } from "@/data/experiences";
import { getAvailability, SlotAvailability } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, isSameDay } from "date-fns";

const ExperienceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const experience = experiences.find((exp) => exp.id === id);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [availability, setAvailability] = useState<SlotAvailability[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate next 30 days for horizontal scroll
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      dates.push(addDays(today, i));
    }
    return dates;
  };

  const availableDates = generateDates();

  useEffect(() => {
    if (selectedDate && experience) {
      fetchAvailability();
    } else {
      setAvailability([]);
    }
  }, [selectedDate]);

  const fetchAvailability = async () => {
    if (!selectedDate || !experience) return;
    
    setLoading(true);
    try {
      const dateStr = format(selectedDate, "MMM dd");
      const response = await getAvailability(experience.id, dateStr);
      
      if (response.success) {
        setAvailability(response.availability);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      toast({
        title: "Error",
        description: "Failed to load availability. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!experience) {
    return <div>Experience not found</div>;
  }

  const selectedTimeSlot = availability.find((slot) => slot.time === selectedTime);

  const subtotal = experience.price * quantity;
  const taxes = Math.round(subtotal * 0.06);
  const total = subtotal + taxes;

  const canProceed = selectedDate && selectedTime && selectedTimeSlot && !selectedTimeSlot.soldOut;

  const handleConfirm = () => {
    if (canProceed && selectedDate) {
      navigate("/checkout", {
        state: {
          experienceId: experience.id,
          experienceName: experience.title,
          date: format(selectedDate, "MMM dd"),
          time: selectedTime,
          quantity,
          subtotal,
          taxes,
          total,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-4 sm:py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4 sm:mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <img
              src={experience.image}
              alt={experience.title}
              className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-lg mb-4 sm:mb-6"
            />

            <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{experience.title}</h1>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8">{experience.description}</p>

            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Choose date</h2>
              {/* Mobile: Grid layout */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 md:hidden">
                {availableDates.slice(0, 18).map((date) => {
                    const isSelected = selectedDate && isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, new Date());
                    
                    return (
                      <Button
                        key={date.toISOString()}
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime("");
                        }}
                        className={`h-auto py-2 sm:py-3 px-2 sm:px-3 ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }`}
                      >
                        <div className="text-center w-full space-y-0.5">
                          <div className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
                            {format(date, "EEE")}
                          </div>
                          <div className="text-base sm:text-lg font-bold leading-none">
                            {format(date, "d")}
                          </div>
                          <div className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
                            {format(date, "MMM")}
                          </div>
                          {isToday && (
                            <div className="text-[8px] sm:text-[10px] font-semibold text-primary leading-tight pt-0.5">
                              Today
                            </div>
                          )}
                        </div>
                      </Button>
                    );
                  })}
              </div>
              
              {/* Desktop: Horizontal scroll layout */}
              <div className="hidden md:block">
                <div className="overflow-x-auto overflow-y-hidden pb-2">
                  <div className="flex gap-3 min-w-max">
                    {availableDates.map((date) => {
                      const isSelected = selectedDate && isSameDay(date, selectedDate);
                      const isToday = isSameDay(date, new Date());
                      
                      return (
                        <Button
                          key={date.toISOString()}
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => {
                            setSelectedDate(date);
                            setSelectedTime("");
                          }}
                          className={`min-w-[100px] h-auto py-3 px-4 ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : ""
                          }`}
                        >
                          <div className="text-center w-full space-y-1">
                            <div className="text-xs text-muted-foreground leading-tight">
                              {format(date, "EEE")}
                            </div>
                            <div className="text-xl font-bold leading-none">
                              {format(date, "d")}
                            </div>
                            <div className="text-xs text-muted-foreground leading-tight">
                              {format(date, "MMM")}
                            </div>
                            {isToday && (
                              <div className="text-[10px] font-semibold text-primary leading-tight pt-1">
                                Today
                              </div>
                            )}
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {selectedDate && (
              <div className="mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  Choose time - <span className="text-sm sm:text-base">{format(selectedDate, "MMMM dd, yyyy")}</span>
                </h2>
                {loading ? (
                  <p className="text-muted-foreground">Loading availability...</p>
                ) : availability.length === 0 ? (
                  <p className="text-muted-foreground">
                    No time slots available for this date.
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      {availability.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          onClick={() => setSelectedTime(slot.time)}
                          disabled={slot.soldOut}
                          className={`relative ${
                            selectedTime === slot.time
                              ? "bg-primary text-primary-foreground"
                              : ""
                          }`}
                        >
                          <div className="text-center w-full">
                            <div>{slot.time}</div>
                            {slot.soldOut ? (
                              <div className="text-xs text-destructive">Sold out</div>
                            ) : (
                              <div className="text-xs text-muted-foreground">
                                {slot.available} of {slot.maxCapacity} left
                              </div>
                            )}
                          </div>
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      All times are in IST (GMT +5:30)
                    </p>
                  </>
                )}
              </div>
            )}

            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">About</h2>
              <p className="text-muted-foreground text-sm sm:text-base bg-secondary p-3 sm:p-4 rounded-lg">
                Scenic routes, trained guides, and safety briefing. Minimum age 10.
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="lg:sticky lg:top-24">
              <CardContent className="p-4 sm:p-6">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Starts at</p>
                  <p className="text-2xl font-bold">₹{experience.price}</p>
                </div>

                <div className="mb-4 pb-4 border-b">
                  <p className="text-sm text-muted-foreground mb-2">Quantity</p>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-lg font-semibold w-8 text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setQuantity(
                          Math.min(selectedTimeSlot?.available || 10, quantity + 1)
                        )
                      }
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxes</span>
                    <span>₹{taxes}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <Button
                  onClick={handleConfirm}
                  disabled={!canProceed}
                  className={`w-full ${
                    canProceed
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  }`}
                  size="lg"
                >
                  Confirm
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExperienceDetail;
