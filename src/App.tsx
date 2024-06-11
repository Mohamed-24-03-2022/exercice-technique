import { useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import { v4 as uuidv4 } from 'uuid';

import { Tree } from 'primereact/tree';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import './index.css';

import { FaBuilding } from 'react-icons/fa';
import { BsFillBuildingsFill } from 'react-icons/bs';
import { TbTemperatureSnow, TbTemperatureSun } from 'react-icons/tb';
import { SiLocal } from 'react-icons/si';

import registersSample from './registers.json';

type Id = {
  id: string;
};
type Temp = {
  value: number;
  unit: string;
};
type BuildingZones = {
  zoneName: string;
  electronicDevices: string[];
  tempValue: number;
  tempUnit: string;
};
type Parc = {
  buildingName: string;
  buildingZones: BuildingZones[];
};

type TreeNode = {
  label: string;
  expandedIcon: IconType;
  collapsedIcon: IconType;
  data: Id;
  children: TreeNode[];
  temp?: Temp;
};
type Register = {
  topic: string;
  name: string;
  value: number;
  unit: string;
};
// const treeModel = [
//   {
//     label: 'Parc',
//     expandedIcon: BsFillBuildingsFill,
//     collapsedIcon: BsFillBuildingsFill,
//     data: { id: uuidv4() },
//     children: [
//       {
//         label: 'bâtiment A',
//         expandedIcon: FaBuilding,
//         collapsedIcon: FaBuilding,
//         data: { id: uuidv4() },
//         children: [
//           {
//             label: '3ème étage',
//             data: { id: uuidv4() },
//             expandedIcon: SiLocal,
//             collapsedIcon: SiLocal,
//             children: [
//               {
//                 label: 'Chauffage',
//                 expandedIcon: TbTemperatureSun,
//                 collapsedIcon: TbTemperatureSun,
//                 data: { id: uuidv4() },
//                 temp: {
//                   unit: '°C',
//                   value: 18,
//                 },
//               },
//             ],
//           },
//         ],
//       },
//       {
//         label: 'bâtiment B',
//         expandedIcon: FaBuilding,
//         collapsedIcon: FaBuilding,
//         data: { id: uuidv4() },
//         children: [
//           {
//             label: 'chambre 101',
//             data: { id: uuidv4() },
//             expandedIcon: SiLocal,
//             collapsedIcon: SiLocal,
//             children: [
//               {
//                 label: 'Climatisation',
//                 expandedIcon: TbTemperatureSnow,
//                 collapsedIcon: TbTemperatureSnow,
//                 data: { id: uuidv4() },
//                 temp: {
//                   unit: '°C',
//                   value: 12,
//                 },
//               },
//             ],
//           },
//           {
//             label: 'chambre 102',
//             data: { id: uuidv4() },
//             expandedIcon: SiLocal,
//             collapsedIcon: SiLocal,
//             children: [
//               {
//                 label: 'Climatisation',
//                 expandedIcon: TbTemperatureSnow,
//                 collapsedIcon: TbTemperatureSnow,
//                 data: { id: uuidv4() },
//                 temp: {
//                   unit: '°C',
//                   value: 12,
//                 },
//               },
//             ],
//           },
//           {
//             label: 'chambre 103',
//             data: { id: uuidv4() },
//             expandedIcon: SiLocal,
//             collapsedIcon: SiLocal,
//             children: [
//               {
//                 label: 'Climatisation',
//                 expandedIcon: TbTemperatureSnow,
//                 collapsedIcon: TbTemperatureSnow,
//                 data: { id: uuidv4() },
//                 temp: {
//                   unit: '°C',
//                   value: 13,
//                 },
//               },
//             ],
//           },
//         ],
//       },
//       {
//         label: 'bâtiment C',
//         expandedIcon: FaBuilding,
//         collapsedIcon: FaBuilding,
//         data: { id: uuidv4() },
//         children: [
//           {
//             label: 'bureau 22',
//             data: { id: uuidv4() },
//             expandedIcon: SiLocal,
//             collapsedIcon: SiLocal,
//             children: [
//               {
//                 label: 'Chauffage',
//                 expandedIcon: TbTemperatureSun,
//                 collapsedIcon: TbTemperatureSun,

//                 data: { id: uuidv4() },
//                 temp: {
//                   unit: '°C',
//                   value: 19,
//                 },
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ];

function App() {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [registersData, setRegistersData] = useState<Register[]>([]);

  useEffect(() => {
    // Fetching data from the server
    // fetch('http://localhost:8000/registers', { mode: 'cors' })
    //   .then((response: Response) => {
    //     response.json().then((data: Register[]) => {
    //       setRegistersData(data);
    //     });
    //   })
    //   .catch((error: Error) => {
    //     console.error('Error fetching register data:', error);
    //   });

    setRegistersData(registersSample);
  }, []);

  useEffect(() => {
    // if (!registersData.length) return;

    const parc: Parc[] = [];

    // Data proccessing
    registersData.forEach((register) => {
      const [region, department, city, buildingName, zoneName]: string[] =
        register.topic.split('/');
      const electronicDevice: string = register.name.split(' ')[0];
      const tempValue: number = register.value;
      const tempUnit: string = register.unit;

      const buildingIndex = parc.findIndex(
        (item) => item.buildingName === buildingName
      );

      if (buildingIndex !== -1) {
        const zoneIndex = parc[buildingIndex].buildingZones.findIndex(
          (item) => item.zoneName === zoneName
        );
        if (zoneIndex !== -1) {
          parc[buildingIndex].buildingZones[zoneIndex].electronicDevices.push(
            electronicDevice
          );
        } else {
          parc[buildingIndex].buildingZones.push({
            zoneName,
            electronicDevices: [electronicDevice],
            tempValue,
            tempUnit,
          });
        }
      } else {
        parc.push({
          buildingName,
          buildingZones: [
            {
              zoneName,
              electronicDevices: [electronicDevice],
              tempValue,
              tempUnit,
            },
          ],
        });
      }
    });

    // building the tree (following primeReact pattern)
    const buildTree = (parc: Parc[]): TreeNode[] => {
      const root: TreeNode = {
        label: 'Parc',
        expandedIcon: BsFillBuildingsFill,
        collapsedIcon: BsFillBuildingsFill,
        data: { id: uuidv4() },
        children: [],
      };

      parc.forEach((building) => {
        root.children.push({
          label: building.buildingName,
          expandedIcon: FaBuilding,
          collapsedIcon: FaBuilding,
          data: { id: uuidv4() },
          children: building.buildingZones.map((zone) => {
            return {
              label: zone.zoneName,
              expandedIcon: SiLocal,
              collapsedIcon: SiLocal,
              data: { id: uuidv4() },
              children: zone.electronicDevices.map((device) => {
                return {
                  label: `${device} ${zone.tempValue}${zone.tempUnit}`,
                  expandedIcon:
                    zone.tempValue > 15 ? TbTemperatureSun : TbTemperatureSnow,
                  collapsedIcon:
                    zone.tempValue > 15 ? TbTemperatureSun : TbTemperatureSnow,
                  data: { id: uuidv4() },
                  children: [],
                  temp: {
                    unit: zone.tempUnit,
                    value: zone.tempValue,
                  },
                };
              }),
            };
          }),
        });
      });

      // function getThirdLevelChild(zone: BuildingZones) {
      //   return zone.electronicDevices.map((device) => {
      //     return {
      //       label: `${device} ${zone.tempValue}${zone.tempUnit}`,
      //       expandedIcon:
      //         zone.tempValue > 15 ? TbTemperatureSun : TbTemperatureSnow,
      //       collapsedIcon:
      //         zone.tempValue > 15 ? TbTemperatureSun : TbTemperatureSnow,
      //       data: { id: uuidv4() },
      //       temp: {
      //         unit: zone.tempUnit,
      //         value: zone.tempValue,
      //       },
      //     };
      //   });
      // }

      return [root];
    };

    setTree(buildTree(parc));
  }, [registersData]);

  return (
    <>
      <Tree value={tree} className="w-full md:w-30rem" />{' '}
    </>
  );
}

export default App;
