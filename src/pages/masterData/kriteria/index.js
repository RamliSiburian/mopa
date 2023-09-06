import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteKriteria, getCodes } from "../../../config/Kriteria";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  changeNextCode,
  fetchDataKriteria,
  getAllDatakriteriaState,
} from "../../../store/kriteria/KriteriaDatas";
import { loadDataKriteria } from "../../../store/kriteria/UpdateKriteria";
import { DeleteIcon, EditIcon } from "../../../assets/icons";
import CustomDialogDelete from "../../../components/common/CustomDialogDelete";
import AddKriteria from "../../../components/kriteria/AddKriteria";
import UpdateKriteria from "../../../components/kriteria/UpdateKriteria";
import { fetchDataAlternatif } from "../../../store/alternatif/AlternatifData";

const Kriteria = () => {
  const [openAddKriteria, setOpenAddKriteria] = useState(false);
  const [openUpdateKriteria, setOpenUpdateKriteria] = useState(false);
  const dispatch = useDispatch();
  const [codeToDelete, setCodeToDelete] = useState("");
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { datas, loading } = useSelector(getAllDatakriteriaState);
  const [errorMessageDelete, setErrorMessageDelete] = useState("");

  const getCode = async () => {
    try {
      const {
        data: { data },
      } = await getCodes();
      dispatch(changeNextCode(data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    dispatch(fetchDataKriteria());
    dispatch(fetchDataAlternatif());
  }, [openAddKriteria, openUpdateKriteria]);

  const handleDelete = async () => {
    setIsLoadingDelete(true);
    try {
      const data = await deleteKriteria(codeToDelete);
      setIsLoadingDelete(false);
      setConfirmDelete(false);
      dispatch(fetchDataKriteria());
    } catch (err) {
      console.error(err);
      err.response.status === 500 &&
        setErrorMessageDelete(
          `data "${codeToDelete}" memiliki relasi dengan alternatif`
        );
    } finally {
      setTimeout(() => {
        setConfirmDelete(false);
        setErrorMessageDelete("");
      }, 3000);
    }
  };

  const handleUpdate = (item) => {
    dispatch(
      loadDataKriteria({
        namaKriteria: item.namaKriteria,
        bobot: item.bobot,
        kategori: item.kategory,
        kode: item.kode,
      })
    );
    setOpenUpdateKriteria(true);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          <Typography sx={{ fontSize: "16px", color: "#9E9D9D" }}>
            Kriteria /
          </Typography>

          <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
            List data
          </Typography>
        </Box>
        <Box
          variant="contained"
          sx={{
            background: "#303030",
            width: "75px",
            padding: "6px 8px",
            borderRadius: "4px",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            getCode();
            setOpenAddKriteria(!openAddKriteria);
          }}
        >
          {/* <AddIcon sx={{ color: "#FFF" }} /> */}
          <Typography sx={{ color: "#FFF" }}>Add</Typography>
        </Box>
      </Box>

      <TableContainer sx={{ mt: 3 }}>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow sx={{ background: "#FAFAFA" }}>
              <TableCell align="left">Kode Kriteria</TableCell>
              <TableCell align="left">Nama Kriteria</TableCell>
              <TableCell align="left">Bobot</TableCell>
              <TableCell align="left">Kategori</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datas?.map((item, _) => (
              <TableRow key={item?.kode} sx={{}}>
                <TableCell align="left">{item.kode}</TableCell>
                <TableCell align="left">{item.namaKriteria}</TableCell>
                <TableCell align="left">{item.bobot}</TableCell>
                <TableCell align="left">{item.kategory}</TableCell>
                <TableCell align="center">
                  <EditIcon
                    sx={{ color: "#F79327", cursor: "pointer" }}
                    onClick={() => handleUpdate(item)}
                  />
                  &nbsp;&nbsp;&nbsp;
                  <DeleteIcon
                    sx={{ color: "#B31312", cursor: "pointer" }}
                    onClick={() => {
                      setCodeToDelete(item?.kode);
                      setConfirmDelete(true);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {loading ? (
        <Box
          sx={{
            textAlign: "center",
            padding: "32px 0px",
            background: "rgba(81, 177, 92, .05)",
          }}
        >
          <CircularProgress sx={{ color: "#51B15C" }} size={24} />
        </Box>
      ) : (
        datas.length === 0 && (
          <Box
            sx={{
              padding: "32px 0px",
              textAlign: "center",
              background: "rgba(243, 58, 58, .05)",
            }}
          >
            <Typography sx={{ fontSize: "14px", color: "#F33A3A" }}>
              Nao data found
            </Typography>
          </Box>
        )
      )}

      {/* dialog delete */}

      <CustomDialogDelete
        open={confirmDelete}
        setOpen={setConfirmDelete}
        handleDelete={handleDelete}
        errorMessage={errorMessageDelete}
      />

      <AddKriteria {...{ openAddKriteria, setOpenAddKriteria }} />
      <UpdateKriteria {...{ openUpdateKriteria, setOpenUpdateKriteria }} />
    </Box>
  );
};
export default Kriteria;
