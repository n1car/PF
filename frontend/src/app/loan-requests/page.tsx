import Link from "next/link";
import { apiFetch } from "../../lib/api";
import type { LoanRequest, Tool } from "../../lib/loan-types";

type LoanRequestsPageProps = { searchParams: Promise<{ toolId?: string }> };

export default async function LoanRequestsPage({ searchParams }: LoanRequestsPageProps) {
  
  // TODO FRONT-A: leer searchParams y consultar las solicitudes con apiFetch.
  // TODO FRONT-A: agregar el formulario GET de filtro usando tools y la opción All tools.
  // TODO FRONT-A: mostrar las solicitudes y sus enlaces al comprobante correspondiente.

  const toolsResponse = await apiFetch("/tools");
  const tools: Tool[] = toolsResponse.ok ? await toolsResponse.json() : [];

  
  const { toolId: toolIdParam } = await searchParams;
  const toolId = typeof toolIdParam === "string" ? toolIdParam.trim() : "";

  const query = toolId ? `?toolId=${encodeURIComponent(toolId)}` : "";
  const requestsResponse = await apiFetch(`/loan-requests${query}`);
  const loanRequests: LoanRequest[] = requestsResponse.ok ? await requestsResponse.json() : [];

  return (
    <main>
      <h1>Loan requests</h1>
      <Link className="button" href="/loan-requests/new">New request</Link>

  
      <form className="filters" method="get" action="/loan-requests">
        <label>
          Tool
          <select name="toolId" defaultValue={toolId}>
            <option value="">All tools</option>
            {tools.map((tool) => (
              <option key={tool.id} value={tool.id}>{tool.name}</option>
            ))}
          </select>
        </label>
        <button type="submit">Apply filter</button>
      </form>

      <section className="panel" aria-label="Loan requests">
        {loanRequests.length === 0 ? (
          <p>No loan request found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>Purpose</th>
                <th>Days</th>
                <th>Tool</th>
                <th>Receip</th>
              </tr>
            </thead>
            <tbody>
              {loanRequests.map((loanRequest) => (
                <tr key={loanRequest.id}>
                  <td>{loanRequest.id}</td>
                  <td>{loanRequest.purpose}</td>
                  <td>{loanRequest.days}</td>
                  <td>{loanRequest.tool.name}</td>
                  <td><Link href={`/loan-requests/${loanRequest.id}`}>View receipt</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
