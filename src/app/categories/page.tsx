import { Card } from "@/shared/ui/Card";
import { CategoryForm } from "@/domains/categories/components/CategoryForm";
import { CategoryList } from "@/domains/categories/components/CategoryList";
import { getCategories } from "@/domains/categories/actions";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Categorias</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Nova Categoria</h2>
          <CategoryForm />
        </Card>
        
        <Card>
          <h2 className="text-xl font-semibold mb-4">Categorias Cadastradas</h2>
          <CategoryList categories={categories} />
        </Card>
      </div>
    </div>
  );
}