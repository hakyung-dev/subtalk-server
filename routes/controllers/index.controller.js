const axios = require('axios');

exports.getNearStation = async (req, res, next) => {
  try {
    const location = req.body;
    const station = await axios.get(
      `http://swopenAPI.seoul.go.kr/api/subway/${process.env.SUBWAY_STATION_KEY}/json/nearBy/0/10/${location[0]}/${location[1]}`
    );

    res.status(200).json({
      result: station.data.stationList,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getStationInfo = async (req, res, next) => {
  try {
    const station = await axios.get(
      `http://swopenAPI.seoul.go.kr/api/subway/${
        process.env.SUBWAY_STATION_KEY
      }/json/stationInfo/0/10/${encodeURI(req.body.stationName)}`
    );

    res.status(200).json({
      result: station.data,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getRealtimeArrival = async (req, res, next) => {
  try {
    const station = await axios.get(
      `http://swopenapi.seoul.go.kr/api/subway/${
        process.env.SUBWAY_REALTIME_KEY
      }/json/realtimeStationArrival/0/20/${encodeURI(req.body.stationName)}`
    );
    res.status(200).json({
      result: station.data,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getTrainPosition = async (req, res, next) => {
  try {
    const station = await axios.get(
      `http://swopenapi.seoul.go.kr/api/subway/${
        process.env.SUBWAY_REALTIME_KEY
      }/json/realtimePosition/0/20/${encodeURI(req.body.line)}`
    );

    res.status(200).json({
      result: station.data,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
