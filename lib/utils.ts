export function formatCLP(n: number) {
  return "$" + n.toLocaleString("es-CL");
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}