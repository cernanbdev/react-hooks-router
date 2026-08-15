import { useState } from "react";
import useInput from "./useInput";

function Search() {
  const text = useInput("taylor swift");

  return <input {...text} type="text" />;
}

export default Search;
