import { useState } from 'react';
import styles from './FichaTecnica.module.css';

const LAZER = [
  'Piscina Adulto',
  'Piscina Infantil',
  'Parquinho',
  'Mirante',
  'Quadra Poliesportiva',
  'Brinquedoteca',
  'Espaço Gourmet',
  'Espaço de Eventos',
  'Salão de Jogos',
  'Academia',
  'Pilates',
  'Crioterapia',
  'SPA',
  'Espaço de Beleza',
  'Espaços ao ar livre com lounge',
];

const SEGURANCA = [
  'Câmeras de segurança IP',
  'Controle de acesso por biometria',
  'Automação de iluminação e climatização nos jardins',
  'Sensores de presença nas áreas comuns',
];

const UNIDADES = [
  'Tipo A1 e A2 – 20 unidades',
  'Tipo B – 10 unidades',
  'Tipo C – 12 unidades',
  'Tipo D Duplex – 10 unidades',
];

function Bloco({ titulo, children }) {
  return (
    <div className={styles.bloco}>
      <h3 className={styles.blocoTitulo}>{titulo}</h3>
      <div className={styles.blocoTexto}>{children}</div>
    </div>
  );
}

const Linhas = ({ itens }) => itens.map(t => <p key={t}>{t}</p>);

export default function FichaTecnica() {
  const [noFim, setNoFim] = useState(false);

  // No mobile a página rola: a mãozinha some quando o fim do conteúdo é alcançado
  const onScroll = (e) => {
    const el = e.currentTarget;
    setNoFim(el.scrollTop + el.clientHeight >= el.scrollHeight - 40);
  };

  return (
    <div className={styles.wrap}>
    <div className={styles.root} onScroll={onScroll}>
      <div className={styles.foto}>
        <img src="/img/ficha/ficha-torre.webp" alt="Eden Sky" className={styles.fotoImg} draggable={false} />
        <span className={styles.fotoBarra} />
      </div>

      <div className={styles.painel}>
        <img src="/img/ficha/folhagem-a.webp" alt="" className={styles.folhaA} draggable={false} />
        <img src="/img/ficha/folhagem-b.webp" alt="" className={styles.folhaB} draggable={false} />

        <div className={styles.colunas}>
          <div className={styles.col}>
            <h2 className={styles.titulo}>Sobre</h2>
            <p className={styles.subtitulo}>o EDEN SKY</p>
            <span className={styles.linhaOuro} />

            <Bloco titulo="Localização">
              <p>Rua Rio Paraguaçu – Candeias</p>
              <p>Vitória da Conquista – BA</p>
            </Bloco>
            <Bloco titulo="Padrão"><p>Alto padrão</p></Bloco>
            <Bloco titulo="Zoneamento"><p>ZR-1</p></Bloco>
            <Bloco titulo="Total de Unidades"><Linhas itens={UNIDADES} /></Bloco>
            <Bloco titulo="Tipologias"><p>87,59 m² a 299,45 m²</p></Bloco>
          </div>

          <div className={styles.col}>
            <Bloco titulo="Garagem">
              <p>135 vagas cobertas</p>
              <p>Subsolo e G1</p>
            </Bloco>
            <Bloco titulo="Elevadores"><p>3 elevadores sendo 2 sociais e 1 de serviço</p></Bloco>
            <Bloco titulo="Hall Social"><p>Mobiliado e decorado</p></Bloco>
            <Bloco titulo="Lazer e Convivência"><Linhas itens={LAZER} /></Bloco>
          </div>

          <div className={styles.col}>
            <Bloco titulo="Segurança e Tecnologia"><Linhas itens={SEGURANCA} /></Bloco>
            <Bloco titulo="Medições"><p>Água, luz e gás individualizados</p></Bloco>
            <Bloco titulo="Funcionalidades"><p>Espaço Delivery</p></Bloco>
          </div>
        </div>
      </div>
    </div>

    <img
      src="/img/guidance-hand.gif"
      alt=""
      className={`${styles.dica} ${noFim ? styles.dicaOculta : ''}`}
      draggable={false}
    />
    </div>
  );
}
