import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { Navigate } from 'react-router-dom';

interface Report {
    incident: String,
    location: {
      long: Number
      lat: Number
    },
    address: String
    duration_hours: Number
    description: String
    time: String
    timestamp: Date
    reported_by: String
  }

interface RecentIncidentListProps {
  list: Array<Report>
}

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

const RecentIncidentList: React.FC<RecentIncidentListProps> = ({list}) => {
  return(
    <React.Fragment>
      <Title>Favorite routes</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Incident Type</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((report: Report) => (
            <TableRow>
              <TableCell>{report.incident}</TableCell>
              <TableCell>{report.time}</TableCell>
              <TableCell>{report.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

export {RecentIncidentList}