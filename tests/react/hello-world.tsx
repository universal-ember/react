import React from "react";

export function HelloWorld() {
  return <>hello world</>;
}

export function Greet({ who }: { who: string }) {
  return <>hello, {who}</>;
}

export function GreetMultiple({ greet, who }: { greet: string; who: string }) {
  return (
    <>
      {greet}, {who}
    </>
  );
}
