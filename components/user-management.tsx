"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, RefreshCw, User } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email?: string;
  createdAt: string;
}

interface UserManagementProps {
  onUpdate?: () => void;
}

export function UserManagement({ onUpdate }: UserManagementProps) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError("Erro ao carregar usuarios");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setCreating(true);
    setError(null);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, email: newEmail || undefined }),
      });

      if (!response.ok) throw new Error("Failed to create user");

      setNewName("");
      setNewEmail("");
      await fetchUsers();
      onUpdate?.();
    } catch (err) {
      setError("Erro ao criar usuario");
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuario?")) return;

    try {
      const response = await fetch(`/api/users?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");

      await fetchUsers();
      onUpdate?.();
    } catch (err) {
      setError("Erro ao excluir usuario");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Usuarios Monitorados</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Adicione os nomes que deseja monitorar no Diario Oficial
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </button>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} className="bg-card rounded-lg border border-border p-4">
        <h3 className="font-medium text-foreground mb-3">Adicionar Usuario</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nome completo (ex: JOAO DA SILVA)"
            className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Email (opcional)"
            className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={creating || !newName.trim()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            {creating ? "Adicionando..." : "Adicionar"}
          </button>
        </div>
      </form>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-4 py-3 bg-secondary/50 border-b border-border">
          <span className="text-sm font-medium text-foreground">
            {users.length} usuario(s) cadastrado(s)
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
            Carregando...
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
            Nenhum usuario cadastrado
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">{user.name}</p>
                  {user.email && (
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Criado em: {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  title="Excluir usuario"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
