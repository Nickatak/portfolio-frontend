from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from ..models import TimeSlot
from ..services.booking_policy import (
    find_overlapping_timeslot,
    validate_duration_minutes,
    validate_public_booking_window,
)


class TimeSlotSerializer(serializers.ModelSerializer):
    end_time = serializers.SerializerMethodField()
    datetime = serializers.DateTimeField(source='time')

    class Meta:
        model = TimeSlot
        fields = [
            'id',
            'topic',
            'datetime',
            'duration_minutes',
            'end_time',
            'contact',
            'is_confirmed',
            'is_processed',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'end_time']
        extra_kwargs = {
            'contact': {'required': False, 'allow_null': True},
            'duration_minutes': {'required': False},
            'is_confirmed': {'required': False},
            'is_processed': {'required': False},
        }

    def get_end_time(self, obj):
        """Calculate and return end time from time + duration_minutes."""
        end_dt = obj._get_end_time()
        return end_dt

    def to_representation(self, instance):
        """Override to ensure datetime is shown in output."""
        data = super().to_representation(instance)
        return data

    def validate(self, data):
        start_dt = data.get('time')
        duration_minutes = data.get('duration_minutes')

        if self.instance is not None:
            if start_dt is None:
                start_dt = self.instance.time
            if duration_minutes is None:
                duration_minutes = self.instance.duration_minutes

        if start_dt is None:
            return data

        if duration_minutes is None:
            duration_minutes = 30

        try:
            validate_duration_minutes(duration_minutes)
            if self.context.get('enforce_public_policy', False):
                validate_public_booking_window(start_dt, duration_minutes)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.messages)

        overlap = find_overlapping_timeslot(
            start_dt=start_dt,
            duration_minutes=duration_minutes,
            exclude_id=self.instance.pk if self.instance is not None else None,
        )
        if overlap is not None:
            raise serializers.ValidationError('Time slot overlaps with an existing appointment.')

        return data
