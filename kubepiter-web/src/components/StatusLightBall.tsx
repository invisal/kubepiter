// https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/
export default function StatusLightBall({ status }: { status: string }) {
  const statusLowerCase = status.toLowerCase();

  let color = "#95a5a6";
  if (statusLowerCase === "running") color = "#27ae60";
  if (statusLowerCase === "pending") color = "#f39c12";
  if (statusLowerCase === "failed") color = "#e74c3c";

  return (
    <div
      style={{
        height: 10,
        width: 10,
        background: color,
        borderRadius: "100%",
        display: "inline-block",
      }}
    ></div>
  );
}
