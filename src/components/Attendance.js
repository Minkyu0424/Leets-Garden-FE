import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useCookies } from "react-cookie";

const AttendanceBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  font-family: "Jua", sans-serif;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 1100px;
  height: 360px;
  margin: 20px;
  padding: 10px;
  border-radius: 10px;
  font-size: 30px;
  overflow-y: auto;
`;

const Title = styled.div`
  margin-left: 30px;
  margin-top: 6px;
  font-size: 35px;
  font-family: "Jua", sans-serif;
  color: #8c8c8c;
`;

const EachAttendance = styled.div`
  display: flex;
  align-items: center;
  column-gap: 10px;
  font-size: 22px;
  color: #8c8c8c;
`;

const PersonalBox = styled.div`
  display: flex;
  width: 4em;
`;

const DateBox = styled.div`
  display: flex;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 28px;
  color: ${(props) => (props.isAttended !=='ABSENCE' ? "white" : "black")};
  background-color: ${(props) => (props.isAttended !=='ABSENCE' ? "#548d54" : "#e2e2e2")};
  font-size: 14px;
  padding: 2px;
  
`;
const DateBoxText = styled.span`
  padding: 5px;
  width: 100px;
  color: ${(props) => (props.isAttended !=='ABSENCE' ? "#548d54" : "#e2e2e2")};
  &:hover{
    color: ${(props) => (props.isAttended !=='ABSENCE' ? "#e2e2e2" : "#548d54")};
  }
`;

const Dates = styled.div`
display: flex;
column-gap: 6px;
`

const Select = styled.select`
  font-family: "Jua", sans-serif;
  text-align: center;
  font-size: 24px;
  height: 32px;
  border: none;
  border-radius: 15px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
`;
const AllAttendances = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  row-gap: 6px;
  margin: 10px;
`;
const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [studyOptions, setStudyOptions] = useState([]);
  const [selectedStudy, setSelectedStudy] = useState("");
  const [cookies] = useCookies();
  const token = cookies.token;

  useEffect(() => {
    const getStudyOption = async () => {
      try {
        const res = await axios.get('http://3.39.24.69:8080/meeting/all',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );
        setStudyOptions(res.data);
      } catch (error) {
        console.log(error, "주간 스터디 가져오는데 error발생");
      }
    };
    getStudyOption();
  }, [attendanceData, token]);

  useEffect(() => {
    const getAttendance = async () => {
      try {
        const res = await axios.get(
          `http://3.39.24.69:8080/meeting-weekly/all/${selectedStudy}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAttendanceData(res.data);
      } catch (error) {
        console.log(error, "잔디밭 가져오는데 error발생");
      }
    };
    if (selectedStudy) {
      getAttendance();
    }
  }, [selectedStudy, token]);

console.log(attendanceData);

  const selectStudy = (event) => {
    setSelectedStudy(event.target.value);
  };

  return (
    <div>
      <Title>출석 현황</Title>
      <AttendanceBox>
        <Select value={selectedStudy} onChange={selectStudy}>
          <option value="" disabled>조회 할 모임 선택</option>
          {studyOptions.map((study) => (
            <option key={study.id} value={study.id}>
              {study.name}
            </option>
          ))}
        </Select>
        {selectedStudy && (
          <AllAttendances>
            {attendanceData.map((attendance) => (
              <EachAttendance key={attendance.userId}>
                <PersonalBox>
                {attendance.name}
                </PersonalBox>
                <Dates>
                  {(attendance.attendanceDetailsList).map((details, index) => {
                    console.log("details:", details);
                    return (
                      <DateBox key={index} isAttended={details.attendanceType}>
                        <DateBoxText isAttended={details.attendanceType}>
                          {`${details.meetingDate[1]}.${details.meetingDate[2]}`}
                        </DateBoxText>
                      </DateBox>
                    );
                  }
                  )}
                </Dates>
              </EachAttendance>
            ))}
          </AllAttendances>
        )}
      </AttendanceBox>
    </div>
  );
};
export default Attendance;
