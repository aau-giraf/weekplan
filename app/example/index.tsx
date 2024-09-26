import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { View, Text } from 'react-native';

type LoginData = {
  data: string;
};

const login = async () => {
  const res = await fetch('http://localhost:5000/v2/Account/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'Guardian-dev',
      password: 'password',
    }),
  });

  return await res.json();
};

const Example = () => {
  const { isPending, error, data }: UseQueryResult<LoginData> = useQuery({
    queryKey: ['repoData'],
    queryFn: login,
  });

  return (
    <View>
      <Text>{data?.data ?? 'Loading...'}</Text>
      <Text>Example Page</Text>
    </View>
  );
};

export default Example;
