export default function calculation(...args) {
   args = args[0]
   console.log(args);


   if (args.work_unit_of_measurement === 'running_meter' && args.material_unit_of_measurement === 'packing_unit' && args.expenditure_measurement === 'running_meter') {
      return formula1(args)
   }

   if (args.work_unit_of_measurement === 'unit' && args.material_unit_of_measurement === 'packing_kilogram' && args.expenditure_measurement === 'm2_layer') {
      return formula2(args)
   }


   return undefined
}

// формула расчета плинтусов
function formula1({material_quantity, expenditure, work_scope}) {
   return Math.ceil(parseFloat(work_scope) / parseFloat(expenditure.units) / parseFloat(material_quantity))
}

// формула расчета штукатурки   ???
function formula2({material_quantity, expenditure, work_scope}) {
   // нужно кг на м2
   const kg = parseFloat(expenditure.layer) / parseFloat(expenditure.consumption_layer) * parseFloat(expenditure.consumption)
   console.log(kg)
   // сколько м2 можно сделать с 1й упаковкой
   const m2_per_package = parseFloat(material_quantity) / kg
   console.log(m2_per_package);
   return Math.ceil(parseFloat(work_scope) / m2_per_package)
}
