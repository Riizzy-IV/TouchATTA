export default function ZimbelLogo({ width = 200, style = {} }) {
  const ratio = 1920 / 349;
  const height = width / ratio;
  return (
    <img
      src="/img/logo_negativo.svg"
      width={width}
      height={height}
      alt="Zimbel Incorporadora"
      draggable={false}
      style={{ display: 'block', ...style }}
    />
  );
}
