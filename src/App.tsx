import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Tree } from 'primereact/tree';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import './index.css';

import { FaBuilding } from 'react-icons/fa';
import { BsFillBuildingsFill } from 'react-icons/bs';
import { TbTemperatureSnow, TbTemperatureSun } from 'react-icons/tb';
import { SiLocal } from 'react-icons/si';

import registersData from './registers.json';
import { IconType } from 'react-icons';

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
  children?: TreeNode[];
  temp?: Temp;
};

// type structuredRegister = {
//   region: string;
//   department: string;
//   city: string;
//   building: string;
//   zone: string;
//   electronicDevice: string;
//   tempValue: number;
//   tempUnit: string;
// };

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

// const removeDuplicates = (list: string[]) =>
//   list.filter((item: string, index: number) => list.indexOf(item) === index);

function App() {
  // const structuredRegisterData: structuredRegister[] = [];
  // structuredRegisterData.push({
  //   region,
  //   department,
  //   city,
  //   building,
  //   zone,
  //   electronicDevice,
  //   tempValue,
  //   tempUnit,
  // });

  const parc: Parc[] = [];
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

  const buildTree = (parc: Parc[]): TreeNode[] => {
    const root: TreeNode = {
      label: 'Parc',
      expandedIcon: BsFillBuildingsFill,
      collapsedIcon: BsFillBuildingsFill,
      data: { id: uuidv4() },
      children: [],
    };

    parc.forEach((building) => {
      if (root.children) {
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
                  temp: {
                    unit: zone.tempUnit,
                    value: zone.tempValue,
                  },
                };
              }),
            };
          }),
        });
      }
    });

    return [root];
  };

  console.log('root', buildTree(parc));
  console.log('parc', parc);

  return (
    <>
      <Tree value={buildTree(parc)} className="w-full md:w-30rem" />{' '}
    </>
  );
}

export default App;
