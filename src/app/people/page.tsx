import { Card } from "@/shared/ui/Card";
import { PersonForm } from "@/domains/people/components/PersonForm";
import { PersonList } from "@/domains/people/components/PersonList";
import { getPeople } from "@/domains/people/actions";

export default async function PeoplePage() {
  const people = await getPeople();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Pessoas</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Nova Pessoa</h2>
          <PersonForm />
        </Card>
        
        <Card>
          <h2 className="text-xl font-semibold mb-4">Pessoas Cadastradas</h2>
          <PersonList people={people} />
        </Card>
      </div>
    </div>
  );
}