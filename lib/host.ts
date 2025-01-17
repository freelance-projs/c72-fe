export default function GetHostLocation(): string {
  if (typeof window !== undefined) {
    return "http://" + window.location.hostname + ":8080"
  }
  return process.env.NEXT_PUBLIC_API || "http://localhost:3000"
}
