from rest_framework import serializers
from ..models.LabelModel import Label

class LabelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Label
        fields = ["id", "name", "project"]
        read_only_fields = ["id"]