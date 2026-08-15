import { useState } from "react";
import useInput from "./useInput";

function Form() {
  const name = useInput("ed sheeran");
  console.log(name);
  const dob = useInput("1/1/2020");

  return (
    <>
      <input {...name} type="text" />
      <input {...dob} type="text" />
    </>
  );
}

export default Form;
