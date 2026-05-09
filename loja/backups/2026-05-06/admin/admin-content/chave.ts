// Auto-extracted from 12.html (faber-shop.live admin) -- <main> inner only
export const html = `
                                      <div class="max-w-lg">
                                        <div class="bg-white rounded-xl border border-gray-100 p-6 flex flex-col gap-5">
                                          <div>
                                            <label class="block text-xs text-gray-500 mb-3">Modo de autenticação</label>
                                            <div class="flex flex-col gap-2">
                                              <label class="flex items-start gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors border-rose-400 bg-rose-50">
                                                <input class="mt-0.5" type="radio" value="bearer" checked="">
                                                  <div>
                                                    <p class="text-sm font-medium text-gray-700">Bearer Token (novo)</p>
                                                    <p class="text-xs text-gray-400">Usa apenas a Secret Key. Modo atual da Streetpay.</p>
                                                  </div>
                                                </label>
                                                <label class="flex items-start gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors border-gray-200">
                                                  <input class="mt-0.5" type="radio" value="basic">
                                                    <div>
                                                      <p class="text-sm font-medium text-gray-700">Basic Auth (legado)</p>
                                                      <p class="text-xs text-gray-400">Usa Public Key + Secret Key. Método anterior.</p>
                                                    </div>
                                                  </label>
                                                </div>
                                              </div>
                                              <div>
                                                <label class="block text-xs text-gray-500 mb-1">Secret Key *</label>
                                                <input class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-400 transition-colors font-mono" placeholder="dqIt0LQWa_yM8oF..." type="text" value="dqIt0LQWa_yM8oFtIUhltCtdZ2QPQ57E6Pg6P92GNhY">
                                                </div>
                                                <button class="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-lg py-2.5 text-sm transition-colors">Salvar chaves</button>
                                              </div>
                                            </div>
                                          `;
export const title = "Chave StreetPay";
