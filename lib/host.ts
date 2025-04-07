export default function GetHostLocation(): string {
   return process.env.NEXT_PUBLIC_API || "http://localhost:3000"
}
