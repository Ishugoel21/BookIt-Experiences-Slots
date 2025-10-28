import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Experience } from "@/types/experience";
import { useNavigate } from "react-router-dom";

interface ExperienceCardProps {
  experience: Experience;
}

export const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={experience.image}
          alt={experience.title}
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
          {experience.category}
        </Badge>
      </div>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{experience.title}</h3>
          <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded">
            {experience.location}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {experience.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">From </span>
            <span className="text-lg font-bold">₹{experience.price}</span>
          </div>
          <Button
            onClick={() => navigate(`/experience/${experience.id}`)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
