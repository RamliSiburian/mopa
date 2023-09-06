 export function PerbandinganBerpasangan ( item1 = 0 , item2 = 0 ) {
  let nilaiPerbandingan;

  const bobot = item1 - item2

  switch (bobot) {
    case 0.05:
      nilaiPerbandingan = 1;
      break;
    case 0.10:
      nilaiPerbandingan = 3;
      break;
    case 0.15:
      nilaiPerbandingan = 5;
      break;
      case 0.20:
        nilaiPerbandingan = 7;
        break;
    default:
      nilaiPerbandingan = 0;
  }

  return nilaiPerbandingan;
};




export default PerbandinganBerpasangan