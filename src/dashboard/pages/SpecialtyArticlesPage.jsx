import { useParams } from "react-router-dom";
import ArticlesPage from "./ArticlesPage";

function SpecialtyArticlesPage() {
  const { specialty } = useParams();

  return <ArticlesPage initialSpecialtySlug={specialty || ""} mode="articles" />;
}

export default SpecialtyArticlesPage;
