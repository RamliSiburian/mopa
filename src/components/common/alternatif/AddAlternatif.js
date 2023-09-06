import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllDataAlternatifState } from "../../../store/alternatif/AlternatifData";
import { createAlternatif } from "../../../config/Alternatif";
import CustomInput from "../atoms/CustomInput";
import CustomButton from "../atoms/CustomButton";
import { CloseIcon } from "../../../assets/icons";

const AddAlternatif = ({
  openAddAlternatif,
  setOpenAddAlternatif,
  kodeKriteria,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { nextCode } = useSelector(getAllDataAlternatifState);
  const [namaAlternatif, setNamaAlternatif] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nilaiKriteria, setNilaiKriteria] = useState([]);

  useEffect(() => {
    const kriteriaDatas = kodeKriteria?.map((data, _) => ({
      kode: nextCode,
      namaAlternatif: namaAlternatif,
      kodeKriteria: data,
      nilai: Number(),
    }));

    setNilaiKriteria(kriteriaDatas);
  }, [kodeKriteria, namaAlternatif]);

  //!   validation
  const [isErrorName, setIsErrorName] = useState(false);

  // ! handler
  const handleClose = () => {
    setOpenAddAlternatif(false);
  };

  // const saveData = async (data) => {
  //   setIsLoading(true);
  //   try {
  //     await createAlternatif(data);
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setIsLoading(false);
  //     setOpenAddAlternatif(false);
  //   }
  // };

  const saveData = async (data) => {
    setIsLoading(true);
    try {
      await Promise.all(data.map(createAlternatif));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setOpenAddAlternatif(false);
      setNamaAlternatif("");
      setNilaiKriteria([]);
    }
  };

  const handleSave = () => {
    namaAlternatif === "" ? setIsErrorName(true) : setIsErrorName(false);

    // const params = {};
    // params.kode = nextCode;
    // params.NamaAlternatif = namaAlternatif;
    // params.nilaiKriteria = nilaiKriteria;

    // nilaiKriteria?.map((data) => saveData(data))

    // namaAlternatif !== "" && saveData();
    saveData(nilaiKriteria);
  };

  return (
    <Dialog open={openAddAlternatif}>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
            Add Alternatif
          </Typography>
          <Typography onClick={handleClose}>
            <CloseIcon />
          </Typography>
        </Box>
      </DialogTitle>
      <Divider />

      <DialogContent>
        <Grid container columns={12} spacing={2}>
          <Grid item xs={12}>
            <CustomInput value={nextCode} disabled label={"Kode Alternatif"} />
          </Grid>

          <Grid item xs={12}>
            <CustomInput
              isError={isErrorName}
              textError={"nama tidak boleh kosong"}
              value={namaAlternatif}
              label={"Nama Alternatif"}
              setValue={setNamaAlternatif}
            />
          </Grid>

          {kodeKriteria?.map((item, idx) => (
            <Grid item xs={6}>
              <CustomInput
                type="number"
                // isError={isErrorName}
                // textError={"nama tidak boleh kosong"}
                value={nilaiKriteria[idx]?.nilai}
                label={item}
                onChange={(e) => {
                  setNilaiKriteria((prevNilaiKriteria) => {
                    const updatedNilaiKriteria = [...prevNilaiKriteria];
                    updatedNilaiKriteria[idx].nilai = e.target.value;
                    return updatedNilaiKriteria;
                  });
                }}
              />
            </Grid>
          ))}

          {/* button */}
          <Grid item xs={12}>
            <CustomButton
              handleButton={handleSave}
              title={
                isLoading ? (
                  <CircularProgress size={18} sx={{ color: "#FFF" }} />
                ) : (
                  "Save"
                )
              }
              sx={{ color: "#FFF", width: "100%", mt: 1 }}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default AddAlternatif;
