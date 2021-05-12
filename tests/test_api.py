from testing_config import BaseTestConfig
import json


class TestAPI(BaseTestConfig):
    def test_get_spa_from_index(self):
        result = self.app.get("/")
        self.assertIn('<html>', result.data.decode("utf-8"))
