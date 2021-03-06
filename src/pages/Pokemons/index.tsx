import { useState } from 'react'
import { useHistory } from 'react-router'

import { Subtitle } from './styles'

import { ReactComponent as BookmarksIcon } from './bookmarks.svg'

import { usePokemons } from '../../hooks/usePokemons'
import useDebounce from '../../hooks/useDebounce'

import Input from '../../components/Input'
import PokemonList from '../../components/PokemonList'
import IconButton from '../../components/IconButton'
import Button from '../../components/Button'

import {
  Layout,
  LayoutContent,
  LayoutHeader,
} from '../Layout'

type Props = {
  hooks: { usePokemons: typeof usePokemons },
  onBookmarksClick: () => void,
  onLogoutClick: () => void,
  onPokemonClick: (id: number) => void,
}

export const Home = ({
  onBookmarksClick,
  onPokemonClick = () => ({}),
  onLogoutClick = () => ({}),
  hooks,
}: Props): JSX.Element => {
  const [search, setSearch] = useState('')
  const pokemonName = useDebounce(search, 400)

  const { isLoading, data, fetchNextPage } = hooks.usePokemons(pokemonName, [])

  const pokemons = data
    ? data.pages.map(({ data }) => data)
    : []

  return (
    <Layout>
      <LayoutHeader title="Pokédex">
        <IconButton
          ariaLabel="Bookmarks"
          onClick={onBookmarksClick}
          variant="ghost"
          icon={<BookmarksIcon width={24} height={24} />}
        />
        <Button
          onClick={onLogoutClick}
          variant="unstyled"
        >
          Logout
        </Button>
      </LayoutHeader>
      <LayoutContent>
        <Input
          disabled={isLoading}
          name="search"
          placeholder="Search for a pokémon"
          onChange={({ target }) => setSearch(target.value)}
        />
        <Subtitle>
          The Pokédex contains detailed stats for every
          creature from the Pokémon games.
        </Subtitle>
        <PokemonList
          items={pokemons.flat() || []}
          onItemClick={onPokemonClick}
          onLoadMore={() => fetchNextPage && fetchNextPage()}
          loading={isLoading}
        />
      </LayoutContent>
    </Layout>
  )
}

const HomePage = (): JSX.Element => {
  const { push } = useHistory()

  const onLogout = () => {
    localStorage.setItem('session_id', '')
    window.location.reload()
  }

  return (
    <Home
      onBookmarksClick={() => push('/bookmarks')}
      onPokemonClick={id => push(`/pokemons/${id}`)}
      onLogoutClick={onLogout}
      hooks={{ usePokemons }}
    />
  )
}

export default HomePage
