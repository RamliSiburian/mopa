import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages';
import UrlNotFound from './components/common/UrlNotFound';
import Dashboard from './pages/dashboard';
import DataMaster from './pages/masterData';
import AHP from './pages/ahp';
import Alternatif from './pages/masterData/alternatif';
import Kriteria from './pages/masterData/kriteria';
import { API, setAuthToken } from './config/API';
import Topsis from './pages/topsis';
import MOPA from './pages/mopa';
import Perbandingan from './pages/perbandingan';
import Saw from './pages/saw';
import NilaiPerbandingan from './pages/ahp/nilaiPerbandingan/nilaiPerbandingan';
import NilaiPerbandinganMopa from './pages/mopa/nilaiPerbandingan/nilaiPerbandingan';
import UjiAnova from './pages/ujiAnova';
import NilaiPerbandinganKriteria from './pages/ahp/nilaiPerbandinganKriteria/nilaiPerbandingan';

function App() {
  const navigate = useNavigate();
  const checkUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      const response = await API.get('/check-auth');
      let payload = response.data.data;
      payload.token = localStorage.token;

      navigate('/dashboard');
    } catch (error) {
      navigate('/');
      // if (error.response.data.code === 401) {
      // }
    }
  };

  useEffect(() => {
    checkUser();
  }, []);
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/dashboard/" element={<Dashboard />}>
        <Route index element={<Kriteria />} />
        <Route exact path=":data-master/alternatif" element={<Alternatif />} />
        <Route exact path=":data-master/kriteria" element={<Kriteria />} />
        <Route exact path=":menu/topsis" element={<Topsis />} />
        <Route
          exact
          path=":menu/ahp/nilaiahp"
          element={<NilaiPerbandingan />}
        />
        <Route
          exact
          path=":menu/ahp/nilaikriteriaahp"
          element={<NilaiPerbandinganKriteria />}
        />
        <Route exact path=":menu/ahp/hitung" element={<AHP />} />
        <Route
          exact
          path=":menu/mopa/nilaimopa"
          element={<NilaiPerbandinganMopa />}
        />
        <Route exact path=":menu/mopa/hitung" element={<MOPA />} />
        <Route exact path=":menu/saw" element={<Saw />} />
        <Route exact path=":menu/perbandingan" element={<Perbandingan />} />
        {/* <Route exact path=":menu/anova" element={<UjiAnova />} /> */}
        <Route
          exact
          path="dashboard/*"
          element={<UrlNotFound url="/dashboard" />}
        />
      </Route>
      <Route exact path="*" element={<UrlNotFound url="/" />} />
    </Routes>
  );
}

export default App;
