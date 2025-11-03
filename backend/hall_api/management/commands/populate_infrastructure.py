from django.core.management.base import BaseCommand
from hall_api.models import Infrastructure, HallMaster

class Command(BaseCommand):
    help = 'Populates Infrastructure data with predefined values'

    def handle(self, *args, **options):
        infrastructure_data = [
            {'Infra Code': 'I0001', 'Infra Type': 'Furniture', 'Infra Item': '2 Seater Table', 'Nos in Stock': 0},
            {'Infra Code': 'I0002', 'Infra Type': 'Furniture', 'Infra Item': '3 Seater Table', 'Nos in Stock': 0},
            {'Infra Code': 'I0003', 'Infra Type': 'Furniture', 'Infra Item': '6 Seater Table', 'Nos in Stock': 0},
            {'Infra Code': 'I0004', 'Infra Type': 'Furniture', 'Infra Item': 'Office Chair', 'Nos in Stock': 0},
            {'Infra Code': 'I0005', 'Infra Type': 'Furniture', 'Infra Item': 'Plastic Table', 'Nos in Stock': 0},
            {'Infra Code': 'I0006', 'Infra Type': 'Furniture', 'Infra Item': 'Plastic Chair', 'Nos in Stock': 0},
            {'Infra Code': 'I0007', 'Infra Type': 'Furniture', 'Infra Item': 'Moda', 'Nos in Stock': 0},
            {'Infra Code': 'I0008', 'Infra Type': 'Furniture', 'Infra Item': 'Bar Stool', 'Nos in Stock': 0},
            {'Infra Code': 'I0009', 'Infra Type': 'Furniture', 'Infra Item': 'Acrylic Podium', 'Nos in Stock': 0},
            {'Infra Code': 'I0010', 'Infra Type': 'Furniture', 'Infra Item': 'Wooden Podium', 'Nos in Stock': 0},
            {'Infra Code': 'I0011', 'Infra Type': 'Stationery', 'Infra Item': 'A4 Sheet', 'Nos in Stock': 0},
            {'Infra Code': 'I0012', 'Infra Type': 'Stationery', 'Infra Item': 'Note Pad', 'Nos in Stock': 0},
            {'Infra Code': 'I0013', 'Infra Type': 'Stationery', 'Infra Item': 'Ball Pen', 'Nos in Stock': 0},
            {'Infra Code': 'I0014', 'Infra Type': 'Stationery', 'Infra Item': 'Board Marker (Blue)', 'Nos in Stock': 0},
            {'Infra Code': 'I0015', 'Infra Type': 'Stationery', 'Infra Item': 'Board Marker (Black)', 'Nos in Stock': 0},
            {'Infra Code': 'I0016', 'Infra Type': 'Stationery', 'Infra Item': 'Board Marker (Red)', 'Nos in Stock': 0},
            {'Infra Code': 'I0017', 'Infra Type': 'Stationery', 'Infra Item': 'Board Duster', 'Nos in Stock': 0},
            {'Infra Code': 'I0018', 'Infra Type': 'Stationery', 'Infra Item': 'Tissue Paper', 'Nos in Stock': 0},
            {'Infra Code': 'I0019', 'Infra Type': 'Stationery', 'Infra Item': 'null', 'Nos in Stock': 0},
            {'Infra Code': 'I0020', 'Infra Type': 'Stationery', 'Infra Item': 'null', 'Nos in Stock': 0},
            {'Infra Code': 'I0021', 'Infra Type': 'IT Gadgets', 'Infra Item': 'Digital Board Pointer', 'Nos in Stock': 0},
            {'Infra Code': 'I0022', 'Infra Type': 'IT Gadgets', 'Infra Item': 'Wireless Keyboard with Mouse', 'Nos in Stock': 0},
            {'Infra Code': 'I0023', 'Infra Type': 'IT Gadgets', 'Infra Item': 'Conference Speaker with Mike', 'Nos in Stock': 0},
            {'Infra Code': 'I0024', 'Infra Type': 'IT Gadgets', 'Infra Item': 'Wifi Router Dongle', 'Nos in Stock': 0},
            {'Infra Code': 'I0025', 'Infra Type': 'IT Gadgets', 'Infra Item': 'Pen Drive / Zip Drive', 'Nos in Stock': 0},
            {'Infra Code': 'I0026', 'Infra Type': 'Electronics Gadgets', 'Infra Item': 'Internal Speaker with Mikes', 'Nos in Stock': 0},
            {'Infra Code': 'I0027', 'Infra Type': 'Electronics Gadgets', 'Infra Item': 'External Speaker with Mikes', 'Nos in Stock': 0},
            {'Infra Code': 'I0028', 'Infra Type': 'Electronics Gadgets', 'Infra Item': 'Power Extension Box', 'Nos in Stock': 0},
            {'Infra Code': 'I0029', 'Infra Type': 'Electronics Gadgets', 'Infra Item': 'AC Remote', 'Nos in Stock': 0},
            {'Infra Code': 'I0030', 'Infra Type': 'Electronics Gadgets', 'Infra Item': 'TV Remote', 'Nos in Stock': 0},
            {'Infra Code': 'I0031', 'Infra Type': 'Cafeteria', 'Infra Item': 'Plastic Tray', 'Nos in Stock': 0},
            {'Infra Code': 'I0032', 'Infra Type': 'Cafeteria', 'Infra Item': 'China Coffee Cups', 'Nos in Stock': 0},
            {'Infra Code': 'I0033', 'Infra Type': 'Cafeteria', 'Infra Item': 'China Snacks Saucer', 'Nos in Stock': 0},
            {'Infra Code': 'I0034', 'Infra Type': 'Cafeteria', 'Infra Item': 'Steel Water Bottles', 'Nos in Stock': 0},
            {'Infra Code': 'I0035', 'Infra Type': 'Cafeteria', 'Infra Item': 'null', 'Nos in Stock': 0},
        ]

        # For simplicity, we'll assign these to the first HallMaster found.
        # In a real application, you might have logic to associate infrastructure
        # with specific halls or make 'hall' nullable in the Infrastructure model
        # if infrastructure can exist independently of a hall.
        try:
            hall_instance = HallMaster.objects.first()
            if not hall_instance:
                self.stdout.write(self.style.ERROR("No HallMaster instances found. Please populate halls first."))
                return
        except HallMaster.DoesNotExist:
            self.stdout.write(self.style.ERROR("No HallMaster instances found. Please populate halls first."))
            return

        for data in infrastructure_data:
            infra, created = Infrastructure.objects.get_or_create(
                infra_code=data['Infra Code'],
                defaults={
                    'hall': hall_instance,
                    'infra_type': data['Infra Type'],
                    'infra_item': data['Infra Item'],
                    'nos_in_stock': data['Nos in Stock'],
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Successfully created Infrastructure: {infra.infra_item}"))
            else:
                self.stdout.write(self.style.WARNING(f"Infrastructure already exists: {infra.infra_item}"))

        self.stdout.write(self.style.SUCCESS('Infrastructure data population complete.'))