import { Link } from "react-router-dom";
import { SearchResult } from "./SearchResult";
import "./SearchResultsList.css";


export const SearchResultsList = ({ results }) => {
  return (
    <div className="results-list">
      {results.map((result, id) => {
        return <Link to={`/users/${result.id}`}><SearchResult result={result.name} key={id} /></Link>;
        
      })}
    </div>
  );
};