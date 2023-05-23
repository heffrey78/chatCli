import { Container } from "inversify";
import { TYPES, IStrategy } from "./types";
import Search from "./services/web/search";
import SearchResult from "./entities/web/SearchResult";

const container = new Container();

container.bind<IStrategy<SearchResult[]>>(TYPES.IStrategy).to(Search).whenTargetNamed("search");

export default container;