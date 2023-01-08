export const globalStyles = () =>
  Array.from(document.styleSheets).map((s) => s.ownerNode.cloneNode(true));
