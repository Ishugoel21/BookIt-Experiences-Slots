import { Header } from "@/components/Header";
import { ExperienceCard } from "@/components/ExperienceCard";
import { experiences } from "@/data/experiences";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {experiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
