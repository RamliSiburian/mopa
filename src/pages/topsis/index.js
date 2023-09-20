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
import { changeNilaiAkhirTopsis } from '../../store/topsis';
import { changeDataAnova } from '../../store/anova';
import { getResultAnova } from '../../config/perbandinganMopa';

const Topsis = () => {
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

  const joinNilaiAlternatif = newDataToShow?.map((item, index) => item?.nilai);

  // kuadrat nilai
  const kuadratNilai = joinNilaiAlternatif?.map((item, idx) => {
    return item.map((nilai, index) => nilai * nilai);
  });

  // total kuadrat nilai
  const totalKuadratNilai = kuadratNilai?.reduce((result, arr) => {
    arr.forEach((num, index) => {
      result[index] = (result[index] || 0) + num;
    });
    return result;
  }, []);

  // normalisasi
  const normalisasi = newDataToShow?.map((item, idx) =>
    item?.nilai?.map(
      (nilaiC, index) => nilaiC / Math.sqrt(totalKuadratNilai[index]) || '-'
    )
  );

  // normalisasi terbobot
  const transposeData = (arr) => {
    return arr[0]?.map((_, colIndex) => arr?.map((row) => row[colIndex]));
  };
  const newData = transposeData(normalisasi);
  const normalisasiTerbobot = normalisasi.map((item, idx) =>
    item?.map((nilai, idx) => nilai * dataKriteria[idx]?.bobot)
  );

  // matriks solusi ideal
  const costBenefit = transposeData(normalisasiTerbobot);

  const positifNegatif = costBenefit?.map((subArray, idx) => {
    const cek = dataKriteria.some(
      (item) => item.kode === kodeKriteria[idx] && item.kategory === 'Cost'
    );
    return cek
      ? { positif: Math.min(...subArray), negatif: Math.max(...subArray) }
      : { positif: Math.max(...subArray), negatif: Math.min(...subArray) };
  });

  const resultPositifNegatif = positifNegatif?.reduce(
    (result, item) => {
      result.positif.push(item.positif);
      result.negatif.push(item.negatif);
      return result;
    },
    { positif: [], negatif: [] }
  );

  // total
  const total = normalisasiTerbobot?.map((item, idx) =>
    item?.map((data, index) => Math.sqrt(data * data))
  );

  const positif = normalisasiTerbobot.map((arr) =>
    arr.map(
      (value, index) =>
        (resultPositifNegatif.positif[index] - value) *
        (resultPositifNegatif.positif[index] - value)
    )
  );

  const negatif = normalisasiTerbobot.map((arr) =>
    arr.map((value, index) =>
      Math.pow(resultPositifNegatif.negatif[index] - value, 2)
    )
  );

  // hasil akhir positif negatif
  const resultPositif = positif.map((arr) =>
    arr.reduce((sum, value) => sum + value, 0)
  );
  const resultNegatif = negatif.map((arr) =>
    arr.reduce((sum, value) => sum + value, 0)
  );

  const finalResult = newDataToShow?.map(
    (item, idx) =>
      Math.sqrt(resultNegatif[idx]) /
      (Math.sqrt(resultNegatif[idx]) + Math.sqrt(resultPositif[idx]))
  );

  useEffect(() => {
    dispatch(changeJoinData(newDataToShow));
    dispatch(changeNilaiAkhirTopsis(finalResult));
  }, [finalResult]);

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
  //     const slicedData = finalResult?.slice(
  //       startIndexTemp,
  //       startIndexTemp + sliceEnd
  //     );
  //     startIndexTemp += sliceEnd;
  //     return slicedData;
  //   });

  //   const result = finalResult !== undefined && fOnewayAnova(dataUji);
  //   dispatch(
  //     changeDataAnova({
  //       name: 'Topsis',
  //       data: result?.F,
  //       pValue: result?.p_Value,
  //     })
  //   );
  // }, [finalResult, newDataToShow]);

  const getAnova = async (data) => {
    const params = {
      data: data,
      classes: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2],
    };
    try {
      const { data: data } = await getResultAnova(params);
      dispatch(
        changeDataAnova({
          name: 'Topsis',
          data: data?.testValue,
          pValue: data?.pValue,
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const dataToAnova = finalResult?.map((item) => Number(item.toFixed(3)));
    const data =
      dataToAnova !== undefined &&
      dataToAnova.length !== 0 &&
      getAnova(dataToAnova);
    // console.log({ finalResult });
  }, [finalResult]);

  //! ---------------------------------------------------------------------

  const hasilKuadrat = joinNilaiAlternatif?.reduce((result, arr) => {
    const poweredArr = arr.map((num) => Math.pow(num, 2));
    poweredArr.forEach((num, index) => {
      result[index] = (result[index] || 0) + num;
    });
    return result;
  }, []);

  // lanjut mencari nilai hasil kuadrat untuk tahap ke 3

  const highestValue = newData?.map((subArray, idx) => {
    const cek = dataKriteria.some(
      (item) => item.kode === kodeKriteria[idx] && item.kategory === 'Cost'
    );
    return cek
      ? { cost: true, nilai: Math.min(...subArray) }
      : { cost: false, nilai: Math.max(...subArray) };
  });

  // cost & benefit;
  const test = kodeKriteria?.map((kode, idx) => {
    return newData[idx]?.map((item, index) =>
      highestValue[idx]?.cost === true
        ? highestValue[idx]?.nilai / item
        : item / highestValue[idx]?.nilai
    );
  });

  return (
    <Grid container columns={12} spacing={3}>
      <Grid item xs={12}>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: '20px' }}>
            Calculation Using the Topsis method
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
            Step 1 : Normalization (square element)
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow sx={{ background: '#FAFAFA' }}>
                <TableCell align="left">Alternative Name</TableCell>
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
                      {nilaiC * nilaiC || '-'}
                      {/* {item.nilai[index]} */}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              <TableRow sx={{ background: '#CFCFCF', fontWeight: 600 }}>
                <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                {hasilKuadrat.map((total, index) => (
                  <TableCell key={index} sx={{ fontWeight: 600 }}>
                    {Math.round(total)}
                  </TableCell>
                ))}
              </TableRow>
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
            Step 1.1 : Normalization
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
                  <TableCell align="left">{item.kode}</TableCell>
                  {item?.nilai?.map((nilaiC, index) => (
                    <TableCell align="left" key={index}>
                      {(nilaiC / Math.sqrt(hasilKuadrat[index])).toFixed(3) ||
                        '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* langkah 2*/}
      <Grid item xs={10}>
        <Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '16px',
              textDecoration: 'underline',
            }}
          >
            Step 2 : Weighted Normalization
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
                  <TableCell align="left">{item.kode}</TableCell>
                  {item?.nilai?.map((nilaiC, index) => (
                    <TableCell align="left" key={index}>
                      {(
                        (nilaiC / Math.sqrt(hasilKuadrat[index])) *
                        dataKriteria[index]?.bobot
                      ).toFixed(3) || '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* langkah 3*/}
      <Grid item xs={10}>
        <Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '16px',
              textDecoration: 'underline',
            }}
          >
            Step 3 : Ideal solution matrix
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
              <TableRow>
                <TableCell>positif</TableCell>
                {resultPositifNegatif?.positif.map((item, idx) => (
                  <TableCell>{item}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>negatif</TableCell>
                {resultPositifNegatif?.negatif.map((item, idx) => (
                  <TableCell>{item}</TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* langkah 4*/}
      <Grid item xs={10}>
        <Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '16px',
              textDecoration: 'underline',
            }}
          >
            Step 4 : Total
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow sx={{ background: '#FAFAFA' }}>
                <TableCell align="center">#</TableCell>
                <TableCell align="center">Positif</TableCell>
                <TableCell align="center">Negatif`</TableCell>
                <TableCell align="center">Preferensi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {newDataToShow?.map((item, idx) => (
                <TableRow key={idx} sx={{}}>
                  <TableCell align="left">{item.kode}</TableCell>
                  <TableCell align="left">
                    {Math.sqrt(resultPositif[idx]).toFixed(5)}
                  </TableCell>
                  <TableCell align="left">
                    {Math.sqrt(resultNegatif[idx]).toFixed(5)}
                  </TableCell>
                  <TableCell align="left">
                    {(
                      Math.sqrt(resultNegatif[idx]) /
                      (Math.sqrt(resultNegatif[idx]) +
                        Math.sqrt(resultPositif[idx]))
                    ).toFixed(5)}
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

export default Topsis;
