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
import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDataKriteria,
  getAllDataKriteria,
} from '../../store/kriteria/KriteriaDatas';
import {
  changeJoinData,
  fetchDataAlternatif,
  getAllDataAlternatifState,
} from '../../store/alternatif/AlternatifData';
import { useState } from 'react';
// import { PerbandinganBerpasangan } from "../../components/common/PerbandinganBerpasangan";
import { changeNilaiAkhirMopa } from '../../store/mopa';
import { getAllPerbandinganMopa } from '../../store/perbandinganMopa/perbandinganMopa';
import { getAllPerbandinganKriteriaAhp } from '../../store/perbandinganKriteriaAhp/perbandinganKriteriaAhp';
import { changeDataAnova } from '../../store/anova';
import { getResultAnova } from '../../config/perbandinganMopa';

const MOPA = () => {
  const { dataPerbandinganMopa, isLoading } = useSelector(
    getAllPerbandinganMopa
  );
  const { dataPerbandinganKriteria } = useSelector(
    getAllPerbandinganKriteriaAhp
  );
  const dispatch = useDispatch();
  const { datas } = useSelector(getAllDataAlternatifState);
  const [kodeKriteria, setKodeKriteria] = useState([]);
  const dataKriteria = useSelector(getAllDataKriteria);
  const [newDataToShow, setNewDataToShow] = useState([]);

  function PerbandinganBerpasangan(item1 = 0, item2 = 0) {
    let nilaiPerbandingan;

    const bobot = Math.abs(item1 - item2);

    const foundValue = dataPerbandinganMopa.find(
      (entry) => entry.nilai === parseFloat(bobot.toFixed(2))
    );

    if (foundValue) {
      nilaiPerbandingan = foundValue.kode;
    } else {
      nilaiPerbandingan = 1;
    }

    return nilaiPerbandingan;
  }

  useEffect(() => {
    const kode = dataKriteria.map((kode) => kode?.kode);
    setKodeKriteria(kode);
  }, [dataKriteria]);

  useEffect(() => {
    dispatch(fetchDataKriteria());
    dispatch(fetchDataAlternatif());
  }, []);

  useEffect(() => {
    const excepData = datas.reduce((result, item) => {
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

  const totalPerKolom = dataKriteria.reduce((total, item) => {
    return dataKriteria.map((item2, index) => {
      return (
        total[index] +
        (item.bobot > item2.bobot
          ? PerbandinganBerpasangan((item.bobot - item2.bobot).toFixed(2))
          : 1) /
          (item2.bobot > item.bobot
            ? PerbandinganBerpasangan((item2.bobot - item.bobot).toFixed(2))
            : 1)
      );
    });
  }, new Array(dataKriteria.length).fill(0));

  const nilaiRataRata = dataKriteria.map((total, item) => {
    return dataKriteria.map((item2, index) => {
      return Number.isInteger(
        (total.bobot > item2.bobot
          ? PerbandinganBerpasangan((total.bobot - item2.bobot).toFixed(2))
          : 1) /
          (item2.bobot > total.bobot
            ? PerbandinganBerpasangan((item2.bobot - total.bobot).toFixed(2))
            : 1)
      )
        ? (total.bobot > item2.bobot
            ? PerbandinganBerpasangan((total.bobot - item2.bobot).toFixed(2))
            : 1) /
            (item2.bobot > total.bobot
              ? PerbandinganBerpasangan((item2.bobot - total.bobot).toFixed(2))
              : 1)
        : (
            (total.bobot > item2.bobot
              ? PerbandinganBerpasangan((total.bobot - item2.bobot).toFixed(2))
              : 1) /
            (item2.bobot > total.bobot
              ? PerbandinganBerpasangan((item2.bobot - total.bobot).toFixed(2))
              : 1)
          ).toFixed(2);
    });
  });

  const totalPerSubArray = nilaiRataRata.map((subArr) => {
    return subArr.reduce((acc, curr, index) => {
      const parsedValue = parseFloat(curr);
      const result = acc + parsedValue / totalPerKolom[index];
      return result;
    });
  });

  const mapBobot = nilaiRataRata?.map((nr, idx) => {
    const result = [];
    return nr.map((value, index) => [...result, value / totalPerKolom[index]]);
  });

  const rataRata = mapBobot.map((row, idx) => {
    return row.flat().reduce((acc, curr, index) => {
      const parsedValue = parseFloat(curr);
      const result = acc + parsedValue;
      return result;
    });
  });

  const normalisasiCostBenefit = newDataToShow?.map((data) => data.nilai);
  const kodeAlt = newDataToShow?.map((data) => data.kode);

  const cek = kodeAlt?.map((row, index) => {
    return normalisasiCostBenefit?.map((col, colIdx) => {
      return row, col;
    });
  });

  const transposeData = (arr) => {
    return arr[0]?.map((_, colIndex) => arr?.map((row) => row[colIndex]));
  };

  const newData = transposeData(normalisasiCostBenefit);

  const highestValue = newData?.map((subArray, idx) => {
    const cek = dataKriteria.some(
      (item) => item.kode === kodeKriteria[idx] && item.kategory === 'Cost'
    );
    return cek
      ? { cost: true, nilai: Math.min(...subArray) }
      : { cost: false, nilai: Math.max(...subArray) };
  });

  const bobotFinal = rataRata?.map((row, idx) => {
    return row / totalPerKolom.length;
  });

  const test = kodeKriteria?.map((kode, idx) => {
    return newData[idx]?.map((item, index) =>
      highestValue[idx]?.cost === true
        ? highestValue[idx]?.nilai / item
        : item / highestValue[idx]?.nilai
    );
  });

  const finalResult = test?.map((row, idx) => {
    return row?.map((value, index) => value * bobotFinal[idx]);
  });

  const coba = kodeKriteria?.map((kode, idx) =>
    newData[idx]?.map((item, index) =>
      highestValue[idx].cost === true
        ? Number.isInteger(highestValue[idx].nilai / item)
          ? highestValue[idx].nilai / item
          : (highestValue[idx].nilai / item).toFixed(2)
        : Number.isInteger(item / highestValue[idx].nilai)
        ? item / highestValue[idx].nilai
        : (item / highestValue[idx].nilai).toFixed(2)
    )
  );

  const totalCostBenefit = finalResult?.map((subArray) => {
    const sum = subArray?.reduce((acc, curr) => acc + Number(curr), 0);
    return sum;
  });

  const perangkingan = finalResult[0]?.reduce((result, _, index) => {
    const sum = finalResult?.reduce((total, arr) => total + arr[index], 0);
    result.push(sum);
    return result;
  }, []);

  // ! uji anova
  const jStat = require('jstat');

  function fOnewayAnova(groups) {
    const groupMeans = groups.map(
      (group) => group.reduce((sum, value) => sum + value, 0) / group.length
    );
    const totalMean =
      groupMeans.reduce((sum, mean) => sum + mean, 0) / groupMeans.length;

    const betweenGroupSumOfSquares = groupMeans.reduce(
      (sum, mean, index) =>
        sum + groups[index].length * Math.pow(mean - totalMean, 2),
      0
    );

    const withinGroupSumOfSquares = groups.reduce((sum, group, index) => {
      const groupMean = groupMeans[index];
      const groupSumOfSquares = group.reduce(
        (groupSum, value) => groupSum + Math.pow(value - groupMean, 2),
        0
      );
      return sum + groupSumOfSquares;
    }, 0);

    const betweenGroupDegreesOfFreedom = groups.length - 1;
    const withinGroupDegreesOfFreedom = groups.reduce(
      (sum, group) => sum + group.length - 1,
      0
    );

    const betweenGroupMeanSquare =
      betweenGroupSumOfSquares / betweenGroupDegreesOfFreedom;
    const withinGroupMeanSquare =
      withinGroupSumOfSquares / withinGroupDegreesOfFreedom;

    const fStatistic = betweenGroupMeanSquare / withinGroupMeanSquare;

    // Calculate p-value
    const pValue =
      1 -
      jStat.centralF.cdf(
        fStatistic,
        betweenGroupDegreesOfFreedom,
        withinGroupDegreesOfFreedom
      );

    return {
      F: fStatistic,
      p_Value: pValue,
    };
  }

  const getAnova = async (data) => {
    const params = {
      data: data,
      classes: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2],
    };
    try {
      const { data: data } = await getResultAnova(params);
      dispatch(
        changeDataAnova({
          name: 'Mopa',
          data: data?.testValue,
          pValue: data?.pValue,
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // let startIndexTemp = 0;
    // const tempDevided = [{ data1: 7 }, { data2: 4 }, { data3: 7 }];

    // const dataToAnova = perangkingan?.map((item) => Number(item));

    // const dataUji = tempDevided.map((item) => {
    //   const sliceEnd = Object.values(item)[0];
    //   const slicedData = dataToAnova?.slice(
    //     startIndexTemp,
    //     startIndexTemp + sliceEnd
    //   );
    //   startIndexTemp += sliceEnd;
    //   return slicedData;
    // });

    // console.log({ dataUji });

    // const result = dataToAnova !== undefined && fOnewayAnova(dataUji);
    // dispatch(
    //   changeDataAnova({
    //     name: 'Mopa',
    //     data: result?.F,
    //     pValue: result?.p_Value,
    //   })
    // );
    const dataToAnova = perangkingan?.map((item) => Number(item.toFixed(3)));
    dataToAnova !== undefined &&
      dataToAnova.length !== 0 &&
      getAnova(dataToAnova);
  }, [perangkingan, newDataToShow]);

  useEffect(() => {
    dispatch(changeJoinData(newDataToShow));
    dispatch(changeNilaiAkhirMopa(perangkingan));
  }, [perangkingan, newDataToShow]);

  return (
    <Grid container columns={12} spacing={3}>
      <Grid item xs={12}>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: '20px' }}>
            Calculation Using the MOPA Method
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
            Step I : Normalization
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
                      {nilaiC || '-'}
                      {/* {item.nilai[index]} */}
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
            Step 2 : Pairwise Comparisons
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Criteria / Criteria</TableCell>
                {kodeKriteria.map((kode) => (
                  <TableCell key={kode}>{kode}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataKriteria.map((item1, index1) => (
                <TableRow key={item1.kode}>
                  <TableCell>{item1.kode}</TableCell>
                  {dataKriteria.map((item2, index2) => (
                    <TableCell key={item2.kode}>
                      {item2.bobot === item1.bobot ? (
                        '1/1'
                      ) : (
                        <>
                          {item1.bobot > item2.bobot
                            ? PerbandinganBerpasangan(
                                (item1.bobot - item2.bobot).toFixed(2)
                              )
                            : 1}
                          /
                          {item2.bobot > item1.bobot
                            ? PerbandinganBerpasangan(
                                (item2.bobot - item1.bobot).toFixed(2)
                              )
                            : 1}
                        </>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* langkah 2.1 */}
      <Grid item xs={10}>
        <Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '16px',
              textDecoration: 'underline',
            }}
          >
            Step 2.1 : Weightings
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Kriteria / Kriteria</TableCell>
                {kodeKriteria.map((kode) => (
                  <TableCell key={kode}>{kode}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataKriteria.map((item1, index1) => (
                <TableRow key={item1.kode}>
                  <TableCell>{item1.kode}</TableCell>
                  {dataKriteria.map((item2, index2) => (
                    <TableCell key={item2.kode}>
                      {Number.isInteger(
                        (item1.bobot > item2.bobot
                          ? PerbandinganBerpasangan(
                              (item1.bobot - item2.bobot).toFixed(2)
                            )
                          : 1) /
                          (item2.bobot > item1.bobot
                            ? PerbandinganBerpasangan(
                                (item2.bobot - item1.bobot).toFixed(2)
                              )
                            : 1)
                      )
                        ? (item1.bobot > item2.bobot
                            ? PerbandinganBerpasangan(
                                (item1.bobot - item2.bobot).toFixed(2)
                              )
                            : 1) /
                          (item2.bobot > item1.bobot
                            ? PerbandinganBerpasangan(
                                (item2.bobot - item1.bobot).toFixed(2)
                              )
                            : 1)
                        : (
                            (item1.bobot > item2.bobot
                              ? PerbandinganBerpasangan(
                                  (item1.bobot - item2.bobot).toFixed(2)
                                )
                              : 1) /
                            (item2.bobot > item1.bobot
                              ? PerbandinganBerpasangan(
                                  (item2.bobot - item1.bobot).toFixed(2)
                                )
                              : 1)
                          ).toFixed(2)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow sx={{ background: '#CFCFCF', fontWeight: 600 }}>
                <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                {totalPerKolom.map((total, index) => (
                  <TableCell key={index} sx={{ fontWeight: 600 }}>
                    {/* {Number.isInteger(total) ? total : total.toFixed(2)} */}
                    {Math.round(total)}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* langkah 2.2 */}
      <Grid item xs={10}>
        <Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '16px',
              textDecoration: 'underline',
            }}
          >
            Langkah 2.2 : Find the average value
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: 600 }}
                  align="center"
                  colSpan={totalPerKolom.length}
                >
                  Characteristic Values
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Mean Wj</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mapBobot.map((row, index) => (
                <TableRow key={index}>
                  {row.flat().map((value, colIndex) => (
                    <TableCell key={colIndex}>{value.toFixed(2)}</TableCell>
                  ))}
                  <TableCell sx={{ fontWeight: 600 }}>
                    {rataRata[index].toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {(rataRata[index] / totalPerKolom.length).toFixed(2)}
                  </TableCell>
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
            Step 3 : Normalization and Finding Cost and Benefit Values
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                {kodeKriteria.map((kode) => (
                  <TableCell key={kode}>{kode}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {newDataToShow?.map((item, idx) => (
                <TableRow key={idx} sx={{}}>
                  <TableCell align="left">{item.kode}</TableCell>
                  {item?.nilai?.map((nilaiC, index) => (
                    <TableCell align="left" key={index}>
                      {nilaiC || '-'}
                      {/* {item.nilai[index]} */}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {/* langkah 3.1 */}
      <Grid item xs={12}>
        <Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '16px',
              textDecoration: 'underline',
            }}
          >
            Step 3.1 : calculate the cost and benefit values
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                {kodeAlt.map((kode) => (
                  <TableCell key={kode}>{kode}</TableCell>
                ))}
                <TableCell>Start Weight</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {kodeKriteria.map((kode, idx) => (
                <TableRow>
                  <TableCell>{kode}</TableCell>
                  {newData[idx]?.map((item, index) => (
                    <TableCell>
                      {highestValue[idx].cost === true
                        ? Number.isInteger(highestValue[idx].nilai / item)
                          ? highestValue[idx].nilai / item
                          : (highestValue[idx].nilai / item).toFixed(2)
                        : Number.isInteger(item / highestValue[idx].nilai)
                        ? item / highestValue[idx].nilai
                        : (item / highestValue[idx].nilai).toFixed(2)}
                    </TableCell>
                  ))}
                  <TableCell>{bobotFinal[idx].toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {/* <TableRow>
                <TableCell>Total</TableCell>
                {perangkingan?.map((data) => (
                  <TableCell>{data.toFixed(2)}</TableCell>
                ))}
              </TableRow> */}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* langkah 4 */}
      <Grid item xs={6}>
        <Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '16px',
              textDecoration: 'underline',
            }}
          >
            Step 4 : Ranking
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: '#9D9D9D', fontWeight: 600 }}>
                <TableCell sx={{ fontWeight: 600 }}>Alternative</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Analysis Results</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {newDataToShow?.map((item, idx) => (
                <TableRow key={idx} sx={{}}>
                  <TableCell
                    align="left"
                    sx={{
                      fontWeight:
                        Math.max(...perangkingan) === perangkingan[idx] && 600,
                      background:
                        Math.max(...perangkingan) === perangkingan[idx] &&
                        '#E9E9E9',
                    }}
                  >
                    {item.kode}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      fontWeight:
                        Math.max(...perangkingan) === perangkingan[idx] && 600,
                      background:
                        Math.max(...perangkingan) === perangkingan[idx] &&
                        '#E9E9E9',
                    }}
                  >
                    {perangkingan[idx].toFixed(3)}
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

export default MOPA;
