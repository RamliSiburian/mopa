



const nilai = [
  { case: 0, nilai: 1 },
  { case: 1, nilai: 3 },
  { case: 2, nilai: 5 },
  { case: 3, nilai: 7 },
  { case: 4, nilai: 9 }
];



export function PerbandinganAHP(item1 = 0, item2 = 0) {


  let nilaiPerbandingan;

  const bobot = Math.abs(item1 - item2); 

  const foundValue = nilai.find(entry => entry.case === bobot);

  if (foundValue) {
    nilaiPerbandingan = foundValue.nilai;
  } else {
    nilaiPerbandingan = 0;  
  }

  return nilaiPerbandingan;
}

export default PerbandinganAHP;
