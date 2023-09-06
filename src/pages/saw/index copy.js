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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDataAlternatif,
  getAllDataAlternatifState,
} from "../../store/alternatif/AlternatifData";
import {
  fetchDataKriteria,
  getAllDataKriteria,
} from "../../store/kriteria/KriteriaDatas";
import { changeNilaiAkhirSaw } from "../../store/saw";

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

  return (
    <Grid container columns={12} spacing={3}>
      <Grid item xs={12}>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: "20px" }}>
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
              fontSize: "16px",
              textDecoration: "underline",
            }}
          >
            Langkah 1 : Tahap Analisa
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow sx={{ background: "#FAFAFA" }}>
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
              fontSize: "16px",
              textDecoration: "underline",
            }}
          >
            Langkah 2 : Normalisasi
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow sx={{ background: "#FAFAFA" }}>
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
              fontSize: "16px",
              textDecoration: "underline",
            }}
          >
            Langkah 3 : Perangkingan
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow sx={{ background: "#FAFAFA" }}>
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
              {normalisasi?.map((item, idx) => (
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
              fontSize: "16px",
              textDecoration: "underline",
            }}
          >
            Perangkingan
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: "#9D9D9D", fontWeight: 600 }}>
                <TableCell sx={{ fontWeight: 600 }}>Alternatif</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  Nilai Perangkingan
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {totalPerangkingan?.map((item, idx) => (
                <TableRow key={idx} sx={{}}>
                  <TableCell
                    align="left"
                    sx={{
                      fontWeight:
                        Math.max(...totalPerangkingan) ===
                          totalPerangkingan[idx] && 600,
                      background:
                        Math.max(...totalPerangkingan) ===
                          totalPerangkingan[idx] && "#E9E9E9",
                    }}
                  >
                    A{idx + 1}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      fontWeight:
                        Math.max(...totalPerangkingan) ===
                          totalPerangkingan[idx] && 600,
                      background:
                        Math.max(...totalPerangkingan) ===
                          totalPerangkingan[idx] && "#E9E9E9",
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
