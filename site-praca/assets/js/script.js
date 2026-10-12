// Menu no celular
const btn=document.querySelector('.menu-btn'),menu=document.getElementById('menu');
btn?.addEventListener('click',()=>{const a=menu.classList.toggle('aberto');btn.setAttribute('aria-expanded',a)});
// Mini chat (salva só neste navegador; para a vizinhança ver as mensagens um do outro, é preciso um servidor)
const form=document.getElementById('form-chat');
if(form){
  const lista=document.getElementById('mensagens'),KEY='mural-praca';
  const ler=()=>{try{return JSON.parse(localStorage.getItem(KEY))||[]}catch{return[]}};
  const desenhar=m=>{const li=document.createElement('li');li.className='msg';
    const n=document.createElement('strong');n.textContent=m.nome;
    const e=document.createElement('em');e.textContent=m.assunto+' · '+m.hora;
    const t=document.createElement('span');t.textContent=m.texto;
    li.append(n,e,t);lista.append(li);lista.scrollTop=lista.scrollHeight};
  ler().forEach(desenhar);
  form.addEventListener('submit',ev=>{ev.preventDefault();
    const m={nome:nome.value.trim(),assunto:assunto.value,texto:texto.value.trim(),hora:new Date().toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'})};
    const todas=ler();todas.push(m);try{localStorage.setItem(KEY,JSON.stringify(todas))}catch{}
    desenhar(m);texto.value=''});
}
