export default function GetHostLocation(): string {
  return process.env.NEXT_PUBLIC_API || "http://154.26.134.232:5080"
}
