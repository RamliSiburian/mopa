import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
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
import { deleteAlternatif, getCodes } from "../../../config/Alternatif";
import {
  changeLoadingDataAlternatif,
  changeNextCodeAlternatif,
  fetchDataAlternatif,
  getAllDataAlternatifState,
} from "../../../store/alternatif/AlternatifData";
import CustomButton from "../../../components/common/atoms/CustomButton";
import {
  AddIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
} from "../../../assets/icons";
import CustomDialogDelete from "../../../components/common/CustomDialogDelete";
import AddAlternatif from "../../../components/common/alternatif/AddAlternatif";
import {
  fetchDataKriteria,
  getAllDataKriteria,
} from "../../../store/kriteria/KriteriaDatas";
import UpdateAlternatif from "../../../components/common/alternatif/UpdateAlternatif";
import { loadDataAlternatif } from "../../../store/alternatif/UpdateAlternatif";

const Alternatif = () => {
  const [openAddAlternatif, setOpenAddAlternatif] = useState(false);
  const [openUpdateAlternatif, setOpenUpdateAlternatif] = useState(false);
  const dispatch = useDispatch();
  const [codeToDelete, setCodeToDelete] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const { datas, loading } = useSelector(getAllDataAlternatifState);
  const dataKriteria = useSelector(getAllDataKriteria);
  const [kodeKriteria, setKodeKriteria] = useState([]);
  const [newDataToShow, setNewDataToShow] = useState([]);

  const getCode = async () => {
    try {
      const {
        data: { data },
      } = await getCodes();
      dispatch(changeNextCodeAlternatif(data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    dispatch(fetchDataKriteria());
    dispatch(fetchDataAlternatif());
  }, [openAddAlternatif, openUpdateAlternatif]);

  useEffect(() => {
    const kode = dataKriteria.map((kode) => kode?.kode);
    setKodeKriteria(kode);
  }, [dataKriteria]);

  const handleDelete = async () => {
    setIsLoadingDelete(true);
    try {
      await deleteAlternatif(codeToDelete);
      setIsLoadingDelete(false);
      setConfirmDelete(false);
      dispatch(fetchDataAlternatif());
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = (item) => {
    dispatch(
      loadDataAlternatif({
        kode: item.kode,
        namaAlternatif: item.namaAlternatif,
        kodeKriteria: item.kodeKriteria,
        nilai: item.nilai,
      })
    );
    setOpenUpdateAlternatif(true);
  };

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

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = newDataToShow?.slice(indexOfFirstPost, indexOfLastPost);
  const pageNumbers = [];
  const totalPosts = newDataToShow?.length;

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
            Alternatif /
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
            setOpenAddAlternatif(!openAddAlternatif);
          }}
        >
          <AddIcon sx={{ color: "#FFF" }} />
          <Typography sx={{ color: "#FFF" }}>Add</Typography>
        </Box>
      </Box>

      <TableContainer sx={{ mt: 3 }}>
        <Table aria-label="simple table" size="small">
          <TableHead>
            <TableRow sx={{ background: "#FAFAFA" }}>
              <TableCell align="left">Kode Alternatif</TableCell>
              <TableCell align="left">Nama Alternatif</TableCell>
              {kodeKriteria.map((kode, index) => (
                <TableCell align="left" key={index}>
                  {kode}
                </TableCell>
              ))}
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPosts?.map((item, idx) => (
              <TableRow key={idx} sx={{}}>
                <TableCell align="left">{item.kode}</TableCell>
                <TableCell align="left">{item.namaAlternatif}</TableCell>
                {item?.nilai?.map((nilaiC, index) => (
                  <TableCell align="left" key={index}>
                    {nilaiC || "-"}
                  </TableCell>
                ))}
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

      {/* pagination */}
      {datas.length !== 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0px 16px",
          }}
        >
          <Box>
            <Typography>
              Showing {currentPosts?.length} from {newDataToShow?.length} datas
            </Typography>
          </Box>
          <ul
            style={{
              display: "flex",
              gap: 5,
              textDecoration: "none",
              listStyleType: "none",
            }}
          >
            {currentPage <= 1 ? (
              <></>
            ) : (
              <li
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                style={{ cursor: "pointer" }}
              >
                prev
              </li>
            )}
            {pageNumbers?.map((number) => (
              <li
                key={number}
                onClick={() => paginate(number)}
                style={{ color: currentPage === number && "#F33A3A" }}
              >
                {number}
              </li>
            ))}
            {currentPage >= pageNumbers.length ? (
              <></>
            ) : (
              <li
                style={{ cursor: "pointer" }}
                onClick={() =>
                  currentPage < pageNumbers.length &&
                  setCurrentPage(currentPage + 1)
                }
                className="list-pagination"
              >
                next
              </li>
            )}
          </ul>
        </Box>
      )}

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

      <AddAlternatif
        {...{ openAddAlternatif, setOpenAddAlternatif, kodeKriteria }}
      />
      <UpdateAlternatif
        {...{ openUpdateAlternatif, setOpenUpdateAlternatif }}
      />

      {/* dialog delete */}

      <CustomDialogDelete
        open={confirmDelete}
        setOpen={setConfirmDelete}
        handleDelete={handleDelete}
        dataToDelete={codeToDelete}
      />
    </Box>
  );
};

export default Alternatif;
