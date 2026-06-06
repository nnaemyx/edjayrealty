import { getEstates } from "../lib/db";
import EstatesListing from "./EstatesListing";

export default async function EstatesPage() {
  const estates = await getEstates();

  return <EstatesListing estates={estates} />;
}
