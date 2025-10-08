import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Scale, Shield, Users, FileText, Gavel, Home, Heart, Book, AlertCircle, Phone, Briefcase, Star, X } from "lucide-react";

const allRights = [
  { id: 1, title: "Right to Equality", category: "Constitutional", icon: Scale, rating: 5, description: "All persons are equal before law and are entitled to equal protection of laws without discrimination on grounds of religion, race, caste, sex or place of birth." },
  { id: 2, title: "Right to Freedom", category: "Constitutional", icon: Shield, rating: 5, description: "Protection of life and personal liberty. No person shall be deprived of life or liberty except according to procedure established by law (Article 21)." },
  { id: 3, title: "Right Against Exploitation", category: "Constitutional", icon: Users, rating: 5, description: "Prohibition of traffic in human beings, forced labor, and child labor in factories, mines and other hazardous employment." },
  { id: 4, title: "Right to Freedom of Religion", category: "Constitutional", icon: Book, rating: 5, description: "Freedom of conscience and free profession, practice and propagation of religion subject to public order, morality and health." },
  { id: 5, title: "Cultural and Educational Rights", category: "Constitutional", icon: Book, rating: 5, description: "Rights of minorities to conserve their language, script and culture, and to establish and administer educational institutions." },
  { id: 6, title: "Right to Constitutional Remedies", category: "Constitutional", icon: Scale, rating: 5, description: "Right to move the Supreme Court for enforcement of fundamental rights through writs like Habeas Corpus, Mandamus, Prohibition, Certiorari and Quo Warranto." },
  { id: 7, title: "Right to Information", category: "Civil", icon: FileText, rating: 4, description: "Citizens have the right to access information from public authorities to promote transparency and accountability in government (RTI Act, 2005)." },
  { id: 8, title: "Right to Fair Trial", category: "Criminal", icon: Gavel, rating: 5, description: "Every person accused of an offense has the right to defend themselves, get legal representation, and receive a fair and public hearing." },
  { id: 9, title: "Right to Shelter", category: "Constitutional", icon: Home, rating: 4, description: "Right to shelter is a fundamental right under Article 21 of the Constitution, ensuring adequate housing and protection from eviction without due process." },
  { id: 10, title: "Right Against Arrest", category: "Criminal", icon: AlertCircle, rating: 5, description: "Right to be informed of grounds of arrest, right to consult and be defended by a legal practitioner, and right to be produced before magistrate within 24 hours." },
  { id: 11, title: "Right to Privacy", category: "Constitutional", icon: Shield, rating: 5, description: "Fundamental right to privacy under Article 21, including informational privacy, bodily privacy, and privacy of choice." },
  { id: 12, title: "Right to Education", category: "Constitutional", icon: Book, rating: 5, description: "Free and compulsory education for all children aged 6-14 years under Article 21A and Right to Education Act, 2009." },
  { id: 13, title: "Consumer Rights", category: "Civil", icon: Briefcase, rating: 4, description: "Right to safety, information, choice, and redressal under Consumer Protection Act, including protection against unfair trade practices." },
  { id: 14, title: "Right to Legal Aid", category: "Criminal", icon: Scale, rating: 5, description: "Free legal aid to ensure justice is not denied to any citizen due to economic or other disabilities (Article 39A)." },
  { id: 15, title: "Women's Rights", category: "Family", icon: Heart, rating: 5, description: "Protection against domestic violence, sexual harassment, dowry demands, and equal rights in marriage, divorce, and property." },
  { id: 16, title: "Child Rights", category: "Family", icon: Users, rating: 5, description: "Protection from abuse, exploitation, and trafficking. Right to development, participation, and special care under various child protection laws." },
  { id: 17, title: "Property Rights", category: "Civil", icon: Home, rating: 4, description: "Right to acquire, hold and dispose of property subject to reasonable restrictions. Protection against arbitrary deprivation of property." },
  { id: 18, title: "Labor Rights", category: "Civil", icon: Briefcase, rating: 4, description: "Right to fair wages, safe working conditions, reasonable hours of work, and protection against exploitation under various labor laws." },
  { id: 19, title: "Environmental Rights", category: "Constitutional", icon: Shield, rating: 4, description: "Right to clean environment and pollution-free air and water as part of right to life under Article 21." },
  { id: 20, title: "Right to Speedy Trial", category: "Procedural", icon: Gavel, rating: 5, description: "Fundamental right to speedy trial to ensure justice is not delayed. Protection against indefinite detention." },
  { id: 21, title: "Right Against Self-Incrimination", category: "Criminal", icon: Shield, rating: 5, description: "No person accused of any offense shall be compelled to be a witness against himself (Article 20(3))." },
  { id: 22, title: "Right to Bail", category: "Criminal", icon: Scale, rating: 4, description: "Right to reasonable bail in bailable offenses and judicial discretion in non-bailable offenses ensuring personal liberty." },
  { id: 23, title: "Right to Compensation", category: "Civil", icon: FileText, rating: 4, description: "Right to claim compensation for wrongful acts, negligence, defamation, and violation of fundamental rights." },
  { id: 24, title: "Senior Citizen Rights", category: "Civil", icon: Heart, rating: 4, description: "Right to maintenance, medical care, and protection from abuse under Maintenance and Welfare of Parents and Senior Citizens Act." },
  { id: 25, title: "Disability Rights", category: "Civil", icon: Users, rating: 4, description: "Equal opportunities, protection of rights, and full participation under Rights of Persons with Disabilities Act, 2016." },
  { id: 26, title: "Right to Employment", category: "Civil", icon: Briefcase, rating: 4, description: "Right to work and employment opportunities without discrimination based on caste, religion, sex, or disability." },
  { id: 27, title: "Matrimonial Rights", category: "Family", icon: Heart, rating: 4, description: "Rights in marriage including maintenance, custody of children, and fair division of assets in case of divorce." },
  { id: 28, title: "Tenant Rights", category: "Civil", icon: Home, rating: 4, description: "Protection against arbitrary eviction, right to reasonable rent, and proper notice under various tenancy laws." },
  { id: 29, title: "Digital Rights", category: "Civil", icon: Shield, rating: 4, description: "Protection of personal data, right to be forgotten, and safeguards against cyber crimes and online harassment." },
  { id: 30, title: "Right to Vote", category: "Constitutional", icon: Users, rating: 5, description: "Universal adult suffrage ensuring every citizen above 18 years has the right to vote and participate in democratic process." },
];

const categories = ["All", "Constitutional", "Criminal", "Civil", "Family", "Procedural"];

interface RightsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RightsModal({ open, onOpenChange }: RightsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredRights = allRights.filter(right => {
    const matchesSearch = right.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         right.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || right.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-card z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">All 30 Legal Rights</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" data-testid="button-close-rights-modal">
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 border-b sticky top-[72px] bg-card z-10 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-rights"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap hover-elevate active-elevate-2"
                onClick={() => setSelectedCategory(category)}
                data-testid={`filter-${category.toLowerCase()}`}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRights.map((right) => (
              <Card key={right.id} className="p-4 hover-elevate active-elevate-2 transition-all overflow-visible" data-testid={`right-card-${right.id}`}>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <right.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-foreground text-sm leading-tight">
                        {right.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {right.category}
                      </Badge>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < right.rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {right.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredRights.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No rights found matching your search.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
