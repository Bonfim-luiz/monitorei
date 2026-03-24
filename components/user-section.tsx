"use client";

import { useState } from "react";
import { User } from "@/lib/types";

interface UserSectionProps {
  users: User[];
  onUserCreated: () => void;
  onUserDeleted: () => void;
}

export function UserSection({ users, onUserCreated, onUserDeleted }: UserSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create user");
      }

      setName("");
      setEmail("");
      onUserCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating user");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);

    try {
      const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete user");
      }

      onUserDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting user");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create User Form */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold mb-4">Adicionar Usuário para Monitorar</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: JOAO SILVA"
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email (opcional)
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <button
            type="submit"
            disabled={isCreating || !name.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? "Adicionando..." : "Adicionar Usuário"}
          </button>
        </form>
      </div>

      {/* Users List */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Usuários Monitorados ({users.length})</h2>
        </div>
        {users.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Nenhum usuário cadastrado ainda. Adicione um usuário acima.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {users.map((user) => (
              <div key={user.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{user.name}</p>
                  {user.email && (
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Cadastrado em: {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(user.id)}
                  disabled={deletingId === user.id}
                  className="px-3 py-1 text-sm text-destructive hover:bg-destructive/10 rounded-md disabled:opacity-50"
                >
                  {deletingId === user.id ? "Removendo..." : "Remover"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
