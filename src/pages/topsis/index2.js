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
  changeJoinData,
  fetchDataAlternatif,
  getAllDataAlternatifState,
} from "../../store/alternatif/AlternatifData";
import {
  fetchDataKriteria,
  getAllDataKriteria,
} from "../../store/kriteria/KriteriaDatas";
import { changeNilaiAkhirTopsis } from "../../store/topsis";

const Topsis = () => {
  const dispatch = useDispatch();
  const { datas } = useSelector(getAllDataAlternatifState);
  const [kodeKriteria, setKodeKriteria] = useState([]);
  const dataKriteria = useSelector(getAllDataKriteria);
  const [newDataToShow, setNewDataToShow] = useState([]);
  const [hasilKuadrat, setHasilKuadrat] = useState([]);
  const [positifs, setPositifs] = useState([]);
  const [negatives, setNegatives] = useState([]);

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

  const topsis = (data) => {
    // Normalisasi matriks alternatif
    const normalizedMatrix = data?.map((alternative) =>
      alternative.map(
        (value, index) =>
          value / Math.sqrt(data.reduce((sum, alt) => sum + alt[index] ** 2, 0))
      )
    );

    setHasilKuadrat(normalizedMatrix);

    // Menghitung matriks solusi ideal positif (A+) dan matriks solusi ideal negatif (A-)
    const positiveIdeal = normalizedMatrix[0]?.map((_, index) =>
      Math.max(...normalizedMatrix.map((alternative) => alternative[index]))
    );

    const negativeIdeal = normalizedMatrix[0].map((_, index) =>
      Math.min(...normalizedMatrix.map((alternative) => alternative[index]))
    );

    // Menghitung jarak alternatif terhadap matriks solusi ideal positif (S+) dan matriks solusi ideal negatif (S-)
    const positiveDistances = normalizedMatrix.map((alternative) =>
      Math.sqrt(
        alternative.reduce(
          (sum, value, index) => sum + (value - positiveIdeal[index]) ** 2,
          0
        )
      )
    );

    const negativeDistances = normalizedMatrix.map((alternative) =>
      Math.sqrt(
        alternative.reduce(
          (sum, value, index) => sum + (value - negativeIdeal[index]) ** 2,
          0
        )
      )
    );

    setPositifs(positiveDistances);
    setNegatives(negativeDistances);

    // Menghitung skor preferensi dengan metode TOPSIS
    const topsisScores = negativeDistances.map(
      (negDist, index) => negDist / (negDist + positiveDistances[index])
    );

    dispatch(changeNilaiAkhirTopsis(topsisScores));
    console.log({ topsisScores });
  };

  useEffect(() => {
    joinNilaiAlternatif.length !== 0 && topsis(joinNilaiAlternatif);
  }, [joinNilaiAlternatif]);

  return (
    <Grid container columns={12} spacing={3}>
      <Grid item xs={12}>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: "20px" }}>
            Perhitungan Menggunakan metode Topsis
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
            Langkah 1 : Normalisasi (kuadrat element)
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
                      {nilaiC * nilaiC || "-"}
                      {/* {item.nilai[index]} */}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              <TableRow sx={{ background: "#CFCFCF", fontWeight: 600 }}>
                <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                {hasilKuadrat?.map((total, index) => (
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
              fontSize: "16px",
              textDecoration: "underline",
            }}
          >
            Langkah 1.1 : Normalisasi
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
                  <TableCell align="left">{item.kode}</TableCell>
                  {item?.nilai?.map((nilaiC, index) => (
                    <TableCell align="left" key={index}>
                      {(nilaiC / Math.sqrt(hasilKuadrat[index])).toFixed(3) ||
                        "-"}
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
              fontSize: "16px",
              textDecoration: "underline",
            }}
          >
            Langkah 2 : Normalisasi Terbobot
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
                  <TableCell align="left">{item.kode}</TableCell>
                  {item?.nilai?.map((nilaiC, index) => (
                    <TableCell align="left" key={index}>
                      {(
                        (nilaiC / Math.sqrt(hasilKuadrat[index])) *
                        dataKriteria[index]?.bobot
                      ).toFixed(3) || "-"}
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
              fontSize: "16px",
              textDecoration: "underline",
            }}
          >
            Langkah 3 : Matriks solusi ideal
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
              <TableRow>
                <TableCell>positif</TableCell>
                {positifs?.map((item, idx) => (
                  <TableCell>{item}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>negatif</TableCell>
                {negatives?.map((item, idx) => (
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
              fontSize: "16px",
              textDecoration: "underline",
            }}
          >
            Langkah 4 : Total
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow sx={{ background: "#FAFAFA" }}>
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
                    {positifs[idx]?.length !== 0 &&
                      Math.sqrt(positifs[idx]).toFixed(5)}
                  </TableCell>
                  <TableCell align="left">
                    {negatives[idx]?.length !== 0 &&
                      Math.sqrt(negatives[idx]).toFixed(5)}
                  </TableCell>
                  <TableCell align="left">
                    {(
                      negatives[idx]?.length !== 0 &&
                      Math.sqrt(negatives[idx]) /
                        (negatives[idx]?.length !== 0 &&
                          Math.sqrt(negatives[idx]) + positifs[idx]?.length !==
                            0 &&
                          Math.sqrt(positifs[idx]))
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
