import {
  Box,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeJoinData,
  fetchDataAlternatif,
  getAllDataAlternatifState,
} from '../../store/alternatif/AlternatifData';
import {
  fetchDataKriteria,
  getAllDataKriteria,
} from '../../store/kriteria/KriteriaDatas';
import { changeNilaiAkhirSaw } from '../../store/saw';
import Testing from './test';
import { changeDataAnova } from '../../store/anova';
import { getResultAnova } from '../../config/perbandinganMopa';

const Saw = () => {
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
      (item) => item.kode === kodeKriteria[idx] && item.kategory === 'Cost'
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

  const columnSum = normalisasi[0]?.map((col, colIndex) =>
    normalisasi?.reduce((acc, row) => acc + row[colIndex], 0)
  );
  const normalizedAlternatives = normalisasi?.map((row) =>
    row.map((value, colIndex) => value / columnSum[colIndex])
  );
  const weightedScores = normalizedAlternatives.map((row) =>
    row.reduce((acc, value, colIndex) => acc + value * bobot[colIndex], 0)
  );

  useEffect(() => {
    dispatch(changeJoinData(newDataToShow));
    dispatch(changeNilaiAkhirSaw(weightedScores));
  }, [weightedScores]);

  // ! uji anova
  const jStat = require('jstat');

  // function fOnewayAnova(groups) {
  //   const groupMeans = groups.map(
  //     (group) => group.reduce((sum, value) => sum + value, 0) / group.length
  //   );
  //   const totalMean =
  //     groupMeans.reduce((sum, mean) => sum + mean, 0) / groupMeans.length;

  //   const betweenGroupSumOfSquares = groupMeans.reduce(
  //     (sum, mean, index) =>
  //       sum + groups[index].length * Math.pow(mean - totalMean, 2),
  //     0
  //   );

  //   const withinGroupSumOfSquares = groups.reduce((sum, group, index) => {
  //     const groupMean = groupMeans[index];
  //     const groupSumOfSquares = group.reduce(
  //       (groupSum, value) => groupSum + Math.pow(value - groupMean, 2),
  //       0
  //     );
  //     return sum + groupSumOfSquares;
  //   }, 0);

  //   const betweenGroupDegreesOfFreedom = groups.length - 1;
  //   const withinGroupDegreesOfFreedom = groups.reduce(
  //     (sum, group) => sum + group.length - 1,
  //     0
  //   );

  //   const betweenGroupMeanSquare =
  //     betweenGroupSumOfSquares / betweenGroupDegreesOfFreedom;
  //   const withinGroupMeanSquare =
  //     withinGroupSumOfSquares / withinGroupDegreesOfFreedom;

  //   const fStatistic = betweenGroupMeanSquare / withinGroupMeanSquare;

  //   // Calculate p-value
  //   const pValue =
  //     1 -
  //     jStat.centralF.cdf(
  //       fStatistic,
  //       betweenGroupDegreesOfFreedom,
  //       withinGroupDegreesOfFreedom
  //     );

  //   return {
  //     F: fStatistic,
  //     p_Value: pValue,
  //   };
  // }

  // useEffect(() => {
  //   let startIndexTemp = 0;
  //   const tempDevided = [{ data1: 7 }, { data2: 4 }, { data3: 7 }];

  //   const dataUji = tempDevided.map((item) => {
  //     const sliceEnd = Object.values(item)[0];
  //     const slicedData = weightedScores?.slice(
  //       startIndexTemp,
  //       startIndexTemp + sliceEnd
  //     );
  //     startIndexTemp += sliceEnd;
  //     return slicedData;
  //   });

  //   const result = weightedScores !== undefined && fOnewayAnova(dataUji);
  //   dispatch(
  //     changeDataAnova({
  //       name: 'SAW',
  //       data: result?.F,
  //       pValue: result?.p_Value,
  //     })
  //   );
  // }, [weightedScores]);

  const getAnova = async (data) => {
    const params = {
      data: data,
      classes: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2],
    };
    try {
      const { data: data } = await getResultAnova(params);
      dispatch(
        changeDataAnova({
          name: 'SAW',
          data: data?.testValue,
          pValue: data?.pValue,
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const dataToAnova = weightedScores?.map((item) => Number(item.toFixed(3)));
    dataToAnova !== undefined &&
      dataToAnova.length !== 0 &&
      getAnova(dataToAnova);
  }, [weightedScores]);

  return (
    <Grid container columns={12} spacing={3}>
      <Grid item xs={12}>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: '20px' }}>
            Perhitungan Menggunakan metode SAW
          </Typography>
          <Divider />
        </Box>
      </Grid>
      {/* langkah 1 */}
      <Grid item xs={10}>
        <Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '16px',
              textDecoration: 'underline',
            }}
          >
            Langkah 1 : Tahap Analisa
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow sx={{ background: '#FAFAFA' }}>
                <TableCell align="left">Nama Alternatif</TableCell>
                {kodeKriteria.map((kode, index) => (
                  <TableCell align="left" key={index}>
                    {kode}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {newDataToShow?.map((item, idx) => (
                <TableRow key={idx} sx={{}}>
                  <TableCell align="left">
                    {item.namaAlternatif} ({item.kode})
                  </TableCell>
                  {item?.nilai?.map((nilaiC, index) => (
                    <TableCell align="left" key={index}>
                      {nilaiC}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {/* langkah 2 */}
      <Grid item xs={10}>
        <Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '16px',
              textDecoration: 'underline',
            }}
          >
            Langkah 2 : Normalisasi
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow sx={{ background: '#FAFAFA' }}>
                <TableCell align="center">#</TableCell>
                {kodeKriteria.map((kode, index) => (
                  <TableCell align="left" key={index}>
                    {kode}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {normalisasi?.map((item, idx) => (
                <TableRow>
                  <TableCell>A{idx + 1}</TableCell>
                  {item?.map((data, index) => (
                    <TableCell>{data.toFixed(3)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {/* langkah 3 */}
      <Grid item xs={10}>
        <Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '16px',
              textDecoration: 'underline',
            }}
          >
            Langkah 3 : Perangkingan
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow sx={{ background: '#FAFAFA' }}>
                <TableCell align="center">#</TableCell>
                {kodeKriteria.map((kode, index) => (
                  <TableCell align="left" key={index}>
                    {kode}
                  </TableCell>
                ))}
                <TableCell>Total</TableCell>
                {/* <TableCell>Rank</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Bobot</TableCell>
                {bobot?.map((item, idx) => (
                  <TableCell key={idx}>{item}</TableCell>
                ))}
                <TableCell colSpan={2}></TableCell>
              </TableRow>
              {normalizedAlternatives?.map((item, idx) => (
                <TableRow>
                  <TableCell>A{idx + 1}</TableCell>
                  {item?.map((data, index) => (
                    <TableCell>{data.toFixed(3)}</TableCell>
                  ))}
                  <TableCell>{totalPerangkingan[idx].toFixed(3)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={6}>
        <Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '16px',
              textDecoration: 'underline',
            }}
          >
            Perangkingan
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: '#9D9D9D', fontWeight: 600 }}>
                <TableCell sx={{ fontWeight: 600 }}>Alternatif</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  Nilai Perangkingan
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {weightedScores?.map((item, idx) => (
                <TableRow key={idx} sx={{}}>
                  <TableCell
                    align="left"
                    sx={{
                      fontWeight:
                        Math.max(...weightedScores) === weightedScores[idx] &&
                        600,
                      background:
                        Math.max(...weightedScores) === weightedScores[idx] &&
                        '#E9E9E9',
                    }}
                  >
                    A{idx + 1}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      fontWeight:
                        Math.max(...weightedScores) === weightedScores[idx] &&
                        600,
                      background:
                        Math.max(...weightedScores) === weightedScores[idx] &&
                        '#E9E9E9',
                    }}
                  >
                    {item.toFixed(3)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default Saw;
