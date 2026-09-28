import React, { useState } from 'react';
import { UsuarioERP } from '../../types/erp';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';

interface SettingsPermissionsPageProps {
  usuarios: UsuarioERP[];
  onNovoUsuario?: (usuario: UsuarioERP) => void;
}

export const SettingsPermissionsPage: React.FC<SettingsPermissionsPageProps> = ({
  usuarios,
  onNovoUsuario
}) => {
  const { addToast } = useToast();
  const [listaUsuarios, setListaUsuarios] = useState<UsuarioERP[]>(usuarios);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState<UsuarioERP['cargo']>('Operador de Pátio');

  const handleSalvarUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email) return;

    const novo: UsuarioERP = {
      id: `USR-0${listaUsuarios.length + 1}`,
      nome,
      email,
      cargo,
      status: 'Ativo',
      ultimoAcesso: 'Nunca acessou',
      permissoes: ['BALANCA_VIEW', 'ESTOQUE_VIEW']
    };

    setListaUsuarios(prev => [...prev, novo]);
    if (onNovoUsuario) onNovoUsuario(novo);

    addToast({
      title: 'Colaborador Cadastrado',
      message: `Acesso liberado para ${novo.nome} com o perfil ${novo.cargo}.`,
      type: 'success'
    });

    setIsModalOpen(false);
    setNome('');
    setEmail('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Config */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Configurações & Gestão de Permissões (RBAC)
          </h2>
          <p className="text-xs text-slate-500">
            Perfis de acesso por função (Administrador, Caixa, Operador de Pátio e Balança) e trilha de auditoria
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2"
        >
          <svg className="w-3.5 h-3.5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Adicionar Usuário</span>
        </button>
      </div>

      {/* Tabela de Usuários */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 uppercase font-mono">
                <th className="py-2.5">Colaborador / Usuário</th>
                <th className="py-2.5">E-mail Corporativo</th>
                <th className="py-2.5">Perfil de Acesso</th>
                <th className="py-2.5">Último Acesso</th>
                <th className="py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {listaUsuarios.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-medium text-slate-900 dark:text-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px] text-slate-700 dark:text-slate-300">
                        {u.nome.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold">{u.nome}</span>
                    </div>
                  </td>
                  <td className="py-3 font-mono text-slate-600 dark:text-slate-400">
                    {u.email}
                  </td>
                  <td className="py-3">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                      {u.cargo}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500 font-mono text-[11px]">
                    {u.ultimoAcesso}
                  </td>
                  <td className="py-3 text-center">
                    <Badge variant={u.status === 'Ativo' ? 'emerald' : 'slate'} size="sm">
                      {u.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo Usuário */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Cadastrar Colaborador no ERP
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSalvarUsuario} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cláudio Ferreira"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  E-mail Corporativo
                </label>
                <input
                  type="email"
                  required
                  placeholder="claudio@paulinhogestao.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Cargo / Função Operacional
                </label>
                <select
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                >
                  <option value="Operador de Balança">Operador de Balança (Recepção)</option>
                  <option value="Operador de Pátio">Operador de Pátio (Desmanche CDV)</option>
                  <option value="Caixa / Comercial">Caixa / Comercial (Balcão PDV)</option>
                  <option value="Administrador">Administrador Geral</option>
                  <option value="Contador Fiscal">Contador Fiscal (SEFAZ)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
                >
                  Confirmar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
