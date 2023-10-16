import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { Navigate } from 'react-router-dom';

interface Route {
  source: String,
  destination: String
}

interface FavouriteRoutesListProps {
  list: Array<Route>
}

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

const FavouriteRoutesList: React.FC<FavouriteRoutesListProps> = ({list}) => {
  return(
    <React.Fragment>
      <Title>Favorite routes</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((route: Route) => (
            <TableRow>
              <TableCell>{route.source}</TableCell>
              <TableCell>{route.destination}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

export {FavouriteRoutesList}