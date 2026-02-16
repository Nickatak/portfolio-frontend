from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Seed production data."

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.WARNING(
                "Production seed is intentionally a no-op."
            )
        )
