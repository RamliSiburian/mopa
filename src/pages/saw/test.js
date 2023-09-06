import React, { useEffect, useState } from "react";
import {
  fetchDataKriteria,
  getAllDataKriteria,
} from "../../store/kriteria/KriteriaDatas";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDataAlternatif,
  getAllDataAlternatifState,
} from "../../store/alternatif/AlternatifData";
import { changeNilaiAkhirSaw } from "../../store/saw";

function Testing() {
  const dispatch = useDispatch();
  const { datas } = useSelector(getAllDataAlternatifState);
  const [kodeKriteria, setKodeKriteria] = useState([]);
  const dataKriteria = useSelector(getAllDataKriteria);
  const [newDataToShow, setNewDataToShow] = useState([]);

  useEffect(() => {
    const kode = dataKriteria.map((kode) => kode?.kode);
    setKodeKriteria(kode);
  }, [dataKriteria]);

  useEffect(() => {
    dispatch(fetchDataKriteria());
    dispatch(fetchDataAlternatif());
  }, []);

  useEffect(() => {
    const excepData = datas?.reduce((result, item) => {
      if (!result[item.kode]) {
        result[item.kode] = {
          kode: item.kode,
          namaAlternatif: item.namaAlternatif,
          kodeKriteria: [],
          nilai: [],
        };
      }

      result[item.kode].kodeKriteria.push(item.kodeKriteria);
      result[item.kode].nilai.push(item.nilai);

      return result;
    }, {});

    // const exceptDataArray = Object.values(excepData);
    const maxNilaiCount = Math.max(
      ...Object.values(excepData).map((obj) => obj.nilai.length)
    );

    const fixLength =
      kodeKriteria?.length > maxNilaiCount
        ? kodeKriteria?.length
        : maxNilaiCount;

    const exceptDataArray = Object.values(excepData).map((obj) => {
      while (obj.nilai.length < fixLength) {
        obj.nilai.push(0);
      }
      return obj;
    });
    setNewDataToShow(exceptDataArray);
  }, [datas]);

  const transposeData = (arr) => {
    return arr[0]?.map((_, colIndex) => arr?.map((row) => row[colIndex]));
  };

  const normalisasiCostBenefit = newDataToShow?.map((data) => data.nilai);
  const kodeAlt = newDataToShow?.map((data) => data.kode);
  const bobot = dataKriteria?.map((data) => data.bobot);

  const cek = kodeAlt?.map((row, index) => {
    return normalisasiCostBenefit?.map((col, colIdx) => {
      return row, col;
    });
  });

  const newData = transposeData(normalisasiCostBenefit);

  const costBenefit = newData?.map((subArray, idx) => {
    const cek = dataKriteria.some(
      (item) => item.kode === kodeKriteria[idx] && item.kategory === "Cost"
    );
    return cek
      ? { cost: true, nilai: Math.min(...subArray) }
      : { cost: false, nilai: Math.max(...subArray) };
  });

  //   normalisasi
  const normalisasi = normalisasiCostBenefit?.map((data, idx) => {
    return data?.map((item, index) => {
      return costBenefit[index]?.cost === true
        ? costBenefit[index]?.nilai / item
        : item / costBenefit[index]?.nilai;
    });
  });

  //   perangkingan
  const perangkingan = normalisasi?.map((data, item) =>
    data?.map((item, idx) => item * bobot[idx])
  );

  const totalPerangkingan = perangkingan.map((arr) =>
    arr.reduce((sum, value) => sum + value)
  );

  useEffect(() => {
    dispatch(changeNilaiAkhirSaw(totalPerangkingan));
  }, [totalPerangkingan]);

  // Calculate the sum of each column
  const columnSum = normalisasi[0]?.map((col, colIndex) =>
    normalisasi?.reduce((acc, row) => acc + row[colIndex], 0)
  );
  // Normalize the alternatives matrix
  const normalizedAlternatives = normalisasi?.map((row) =>
    row.map((value, colIndex) => value / columnSum[colIndex])
  );

  // Calculate weighted scores
  const weightedScores = normalizedAlternatives.map((row) =>
    row.reduce((acc, value, colIndex) => acc + value * bobot[colIndex], 0)
  );

  console.log({ normalizedAlternatives });
  return (
    <div>
      <h1>Metode SAW</h1>
      <h2>Skor Preferensi:</h2>
      <ul>
        {weightedScores.map((score, index) => (
          <li key={index}>
            Alternatif {index + 1}: {score.toFixed(3)}
          </li>
        ))}
        ``
      </ul>
    </div>
  );
}

export default Testing;
